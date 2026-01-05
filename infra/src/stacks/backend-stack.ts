import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface BackendStackProps extends cdk.StackProps {
    config: StackConfig;
    vpc: ec2.Vpc;
    databaseSecret: secrets.ISecret;
    tags?: { [key: string]: string };
}

export class BackendStack extends cdk.Stack {
    public readonly service: ecs.FargateService;
    public readonly backendUrl: string;
    public readonly taskDefinition: ecs.FargateTaskDefinition;
    public readonly cluster: ecs.Cluster;

    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create ECR repository for backend
        const repository = new ecr.Repository(this, 'BackendRepository', {
            repositoryName: `${props.config.envName}/fullstack/backend`,
            imageTagMutability: ecr.TagMutability.IMMUTABLE,
            encryption: ecr.RepositoryEncryption.AES_256,
            removalPolicy: props.config.envName === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
        });

        // Create ECS cluster
        this.cluster = new ecs.Cluster(this, 'BackendCluster', {
            vpc: props.vpc,
            clusterName: `${props.config.envName}-backend-cluster`,
            containerInsights: true,
        });

        // Create task execution role
        const taskExecutionRole = new iam.Role(this, 'BackendTaskExecutionRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
            ],
        });

        // Grant permissions to access database secret
        props.databaseSecret.grantRead(taskExecutionRole);

        // Grant permissions to push/pull from ECR
        repository.grantPullPush(taskExecutionRole);

        // Create task definition
        this.taskDefinition = new ecs.FargateTaskDefinition(this, 'BackendTaskDefinition', {
            memoryLimitMiB: props.config.backendMemory,
            cpu: props.config.backendCpu,
            executionRole: taskExecutionRole,
            family: `${props.config.envName}-backend-task`,
            runtimePlatform: {
                cpuArchitecture: ecs.CpuArchitecture.X86_64,
                operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
            },
        });

        // Add container to task definition
        const container = this.taskDefinition.addContainer('BackendContainer', {
            image: ecs.ContainerImage.fromRegistry('node:18-alpine'),
            containerName: 'backend',
            memoryReservationMiB: Math.floor(props.config.backendMemory * 0.8),
            cpu: props.config.backendCpu,
            environment: this.getEnvironmentVariables(props),
            secrets: this.getSecrets(props),
            logging: ecs.LogDriver.awsLogs({
                streamPrefix: 'backend',
                logRetention: logs.RetentionDays.ONE_MONTH,
            }),
            healthCheck: {
                command: ['CMD-SHELL', 'curl -f http://localhost:3000/api/health || exit 1'],
                interval: cdk.Duration.seconds(30),
                timeout: cdk.Duration.seconds(5),
                retries: 3,
                startPeriod: cdk.Duration.seconds(60),
            },
        });

        // Add port mapping
        container.addPortMappings({
            containerPort: 3000,
            hostPort: 3000,
            protocol: ecs.Protocol.TCP,
        });

        // Create load balanced Fargate service
        const loadBalancedService = new ecs_patterns.ApplicationLoadBalancedFargateService(
            this,
            'BackendService',
            {
                cluster: this.cluster,
                taskDefinition: this.taskDefinition,
                desiredCount: props.config.backendDesiredCount,
                publicLoadBalancer: true,
                loadBalancerName: `${props.config.envName}-backend-alb`,
                listenerPort: props.config.certificateArn ? 443 : 80,
                serviceName: `${props.config.envName}-backend-service`,
                healthCheckGracePeriod: cdk.Duration.seconds(120),
                minHealthyPercent: 50,
                maxHealthyPercent: 200,
                circuitBreaker: { rollback: true },
            }
        );

        this.service = loadBalancedService.service;
        this.backendUrl = `http://${loadBalancedService.loadBalancer.loadBalancerDnsName}`;

        // Configure HTTPS if certificate is provided
        if (props.config.certificateArn) {
            const certificate = elbv2.ListenerCertificate.fromArn(props.config.certificateArn);
            loadBalancedService.listener.addCertificates('BackendCertificate', [certificate]);

            // Redirect HTTP to HTTPS
            loadBalancedService.loadBalancer.addListener('HttpListener', {
                port: 80,
                defaultAction: elbv2.ListenerAction.redirect({
                    port: '443',
                    protocol: 'HTTPS',
                    permanent: true,
                }),
            });

            this.backendUrl = `https://${loadBalancedService.loadBalancer.loadBalancerDnsName}`;
        }

        // Configure auto scaling
        const scaling = this.service.autoScaleTaskCount({
            minCapacity: props.config.scalingMinCapacity,
            maxCapacity: props.config.scalingMaxCapacity,
        });

        scaling.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: props.config.scalingTargetCpuUtilization,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(30),
        });

        scaling.scaleOnMemoryUtilization('MemoryScaling', {
            targetUtilizationPercent: 80,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(30),
        });

        // Configure target group health checks
        loadBalancedService.targetGroup.configureHealthCheck({
            path: '/api/health',
            interval: cdk.Duration.seconds(30),
            timeout: cdk.Duration.seconds(5),
            healthyThresholdCount: 2,
            unhealthyThresholdCount: 3,
            healthyHttpCodes: '200-299',
        });

        // Outputs
        new cdk.CfnOutput(this, 'BackendServiceName', {
            value: this.service.serviceName,
            description: 'Backend ECS Service Name',
        });

        new cdk.CfnOutput(this, 'BackendRepositoryUri', {
            value: repository.repositoryUri,
            description: 'Backend ECR Repository URI',
        });
    }

    private getEnvironmentVariables(props: BackendStackProps): Record<string, string> {
        return {
            NODE_ENV: props.config.envName === 'prod' ? 'production' : 'development',
            PORT: '3000',
            LOG_LEVEL: 'info',
            AWS_REGION: props.config.region,
            DATABASE_HOST: props.databaseSecret.secretValueFromJson('host').toString(),
            DATABASE_PORT: props.databaseSecret.secretValueFromJson('port').toString(),
            DATABASE_NAME: props.config.databaseName,
            JWT_SECRET: this.getSecretValue('JWT_SECRET', props),
            JWT_EXPIRATION: '15m',
            JWT_REFRESH_SECRET: this.getSecretValue('JWT_REFRESH_SECRET', props),
            JWT_REFRESH_EXPIRATION: '7d',
            FRONTEND_URL: `https://${this.stackName.replace('backend', 'frontend')}.example.com`,
            REDIS_URL: `redis://${this.stackName.replace('backend', 'redis')}.cache.amazonaws.com:6379`,
            S3_BUCKET_NAME: `${props.config.envName}-fullstack-media`,
            SENTRY_DSN: this.getSecretValue('SENTRY_DSN', props),
        };
    }

    private getSecrets(props: BackendStackProps): Record<string, ecs.Secret> {
        return {
            DATABASE_USERNAME: ecs.Secret.fromSecretsManager(
                props.databaseSecret,
                'username'
            ),
            DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(
                props.databaseSecret,
                'password'
            ),
        };
    }

    private getSecretValue(key: string, props: BackendStackProps): string {
        // In production, these would come from AWS Secrets Manager
        const secrets = {
            JWT_SECRET: this.generateRandomString(64),
            JWT_REFRESH_SECRET: this.generateRandomString(64),
            SENTRY_DSN: '',
        };

        return secrets[key as keyof typeof secrets] || '';
    }

    private generateRandomString(length: number): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .slice(0, length);
    }
}