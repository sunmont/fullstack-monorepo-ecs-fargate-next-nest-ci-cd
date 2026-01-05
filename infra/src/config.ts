import * as cdk from 'aws-cdk-lib';

export interface StackConfig {
    envName: string;
    account: string;
    region: string;
    vpcCidr: string;

    // Database
    databaseInstanceType: string;
    databaseName: string;
    databaseUsername: string;
    databasePort: number;
    backupRetentionDays: number;

    // ECS
    backendCpu: number;
    backendMemory: number;
    backendDesiredCount: number;
    frontendCpu: number;
    frontendMemory: number;
    frontendDesiredCount: number;

    // Auto Scaling
    scalingMinCapacity: number;
    scalingMaxCapacity: number;
    scalingTargetCpuUtilization: number;

    // Security
    allowedCidr: string;
    certificateArn?: string;

    // Monitoring
    alarmEmail: string;
    alarmPhone?: string;

    // CI/CD
    repositoryOwner: string;
    repositoryName: string;
    branchName: string;

    // SonarQube
    sonarToken: string;
    sonarHostUrl: string;
}

export class Config {
    static getConfig(envName: string): StackConfig {
        const baseConfig: Partial<StackConfig> = {
            databaseInstanceType: 't3.medium',
            databaseName: 'fullstack',
            databaseUsername: 'admin',
            databasePort: 27017,
            backupRetentionDays: 7,
            backendCpu: 512,
            backendMemory: 1024,
            backendDesiredCount: 2,
            frontendCpu: 256,
            frontendMemory: 512,
            frontendDesiredCount: 2,
            scalingMinCapacity: 2,
            scalingMaxCapacity: 10,
            scalingTargetCpuUtilization: 70,
            alarmEmail: 'alerts@example.com',
            repositoryName: 'fullstack-monorepo',
            branchName: 'main',
            sonarToken: process.env.SONAR_TOKEN || 'dummy-token',
            sonarHostUrl: process.env.SONAR_HOST_URL || 'http://localhost:9000',
        };

        const envConfigs: Record<string, StackConfig> = {
            dev: {
                envName: 'dev',
                account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
                region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
                vpcCidr: '10.0.0.0/16',
                allowedCidr: '0.0.0.0/0',
                repositoryOwner: 'your-org',
                ...baseConfig,
                backendDesiredCount: 1,
                frontendDesiredCount: 1,
                scalingMinCapacity: 1,
                scalingMaxCapacity: 2,
            },
            staging: {
                envName: 'staging',
                account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
                region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
                vpcCidr: '10.1.0.0/16',
                allowedCidr: '0.0.0.0/0',
                repositoryOwner: 'your-org',
                certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/xxxx',
                ...baseConfig,
                backendDesiredCount: 2,
                frontendDesiredCount: 2,
            },
            prod: {
                envName: 'prod',
                account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
                region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
                vpcCidr: '10.2.0.0/16',
                allowedCidr: '0.0.0.0/0',
                repositoryOwner: 'your-org',
                certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/xxxx',
                ...baseConfig,
                backendDesiredCount: 3,
                frontendDesiredCount: 3,
                scalingMinCapacity: 3,
                scalingMaxCapacity: 15,
                backupRetentionDays: 30,
            },
        };

        const config = envConfigs[envName];
        if (!config) {
            throw new Error(`Configuration not found for environment: ${envName}`);
        }

        // Validate required parameters
        if (envName === 'prod' && !config.certificateArn) {
            throw new Error('Certificate ARN is required for production environment');
        }

        return config;
    }

    static getEnvVariables(config: StackConfig): Record<string, string> {
        return {
            NODE_ENV: config.envName === 'prod' ? 'production' : 'development',
            AWS_REGION: config.region,
            VPC_ID: 'placeholder', // Will be replaced by CDK
            DATABASE_SECRET_ARN: 'placeholder',
            BACKEND_URL: 'placeholder',
            FRONTEND_URL: 'placeholder',
            SONAR_TOKEN: config.sonarToken,
            SONAR_HOST_URL: config.sonarHostUrl,
        };
    }
}