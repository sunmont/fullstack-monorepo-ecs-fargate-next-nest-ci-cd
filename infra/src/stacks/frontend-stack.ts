import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface FrontendStackProps extends cdk.StackProps {
    config: StackConfig;
    vpc: ec2.Vpc;
    backendUrl: string;
    tags?: { [key: string]: string };
}

export class FrontendStack extends cdk.Stack {
    public readonly service: ecs.FargateService;
    public readonly frontendUrl: string;
    public readonly distribution: cloudfront.Distribution;
    public readonly bucket: s3.Bucket;

    constructor(scope: Construct, id: string, props: FrontendStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create S3 bucket for static assets
        this.bucket = new s3.Bucket(this, 'FrontendBucket', {
            bucketName: `${props.config.envName}-fullstack-frontend`,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: props.config.envName === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: props.config.envName !== 'prod',
            versioned: true,
            lifecycleRules: [
                {
                    abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
                    noncurrentVersionExpiration: cdk.Duration.days(30),
                },
            ],
        });

        // Create CloudFront distribution
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(
            this,
            'OriginAccessIdentity',
            {
                comment: 'Access identity for frontend bucket',
            }
        );

        this.bucket.grantRead(originAccessIdentity);

        // Create SSL certificate (use existing ARN or create new)
        let certificate: cloudfront.ICertificate | undefined;

        if (props.config.certificateArn) {
            certificate = cloudfront.Certificate.fromCertificateArn(
                this,
                'FrontendCertificate',
                props.config.certificateArn
            );
        }

        this.distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
            defaultBehavior: {
                origin: new cloudfront_origins.S3Origin(this.bucket, {
                    originAccessIdentity,
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
                responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
                compress: true,
            },
            certificate,
            domainNames: props.config.envName === 'prod'
                ? ['app.example.com']
                : undefined,
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
            ],
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use only North America and Europe
            enabled: true,
            httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            sslSupportMethod: cloudfront.SSLMethod.SNI,
        });

        // Create ECS cluster for frontend (can share with backend)
        const cluster = new ecs.Cluster(this, 'FrontendCluster', {
            vpc: props.vpc,
            clusterName: `${props.config.envName}-frontend-cluster`,
            containerInsights: true,
        });

        // Create task definition for Next.js server
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'FrontendTaskDefinition', {
            memoryLimitMiB: props.config.frontendMemory,
            cpu: props.config.frontendCpu,
            family: `${props.config.envName}-frontend-task`,
            runtimePlatform: {
                cpuArchitecture: ecs.CpuArchitecture.X86_64,
                operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
            },
        });

        // Add container
        const container = taskDefinition.addContainer('FrontendContainer', {
            image: ecs.ContainerImage.fromRegistry('node:18-alpine'),
            containerName: 'frontend',
            memoryReservationMiB: Math.floor(props.config.frontendMemory * 0.8),
            cpu: props.config.frontendCpu,
            environment: {
                NODE_ENV: props.config.envName === 'prod' ? 'production' : 'development',
                PORT: '3000',
                NEXT_PUBLIC_API_URL: props.backendUrl,
                NEXT_PUBLIC_APP_VERSION: '1.0.0',
                NEXT_TELEMETRY_DISABLED: '1',
            },
            logging: ecs.LogDriver.awsLogs({
                streamPrefix: 'frontend',
                logRetention: cdk.aws_logs.RetentionDays.ONE_MONTH,
            }),
            healthCheck: {
                command: ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1'],
                interval: cdk.Duration.seconds(30),
                timeout: cdk.Duration.seconds(5),
                retries: 3,
                startPeriod: cdk.Duration.seconds(60),
            },
        });

        container.addPortMappings({
            containerPort: 3000,
            hostPort: 3000,
            protocol: ecs.Protocol.TCP,
        });

        // Create Fargate service
        this.service = new ecs.FargateService(this, 'FrontendService', {
            cluster,
            taskDefinition,
            desiredCount: props.config.frontendDesiredCount,
            serviceName: `${props.config.envName}-frontend-service`,
            healthCheckGracePeriod: cdk.Duration.seconds(120),
            minHealthyPercent: 50,
            maxHealthyPercent: 200,
            circuitBreaker: { rollback: true },
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        });

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

        // Setup DNS if in production
        if (props.config.envName === 'prod') {
            this.setupDns();
        }

        this.frontendUrl = this.distribution.distributionDomainName;

        // Outputs
        new cdk.CfnOutput(this, 'FrontendDistributionId', {
            value: this.distribution.distributionId,
            description: 'CloudFront Distribution ID',
        });

        new cdk.CfnOutput(this, 'FrontendBucketName', {
            value: this.bucket.bucketName,
            description: 'Frontend S3 Bucket Name',
        });
    }

    private setupDns(): void {
        // This would set up Route53 DNS records
        // For simplicity, we'll just show the pattern

        // const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        //   domainName: 'example.com',
        // });

        // new route53.ARecord(this, 'FrontendARecord', {
        //   zone: hostedZone,
        //   recordName: 'app',
        //   target: route53.RecordTarget.fromAlias(
        //     new route53_targets.CloudFrontTarget(this.distribution)
        //   ),
        // });
    }
}