import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as docdb from 'aws-cdk-lib/aws-docdb';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as backups from 'aws-cdk-lib/aws-backup';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface DatabaseStackProps extends cdk.StackProps {
    config: StackConfig;
    vpc: ec2.Vpc;
    tags?: { [key: string]: string };
}

export class DatabaseStack extends cdk.Stack {
    public readonly database: docdb.DatabaseCluster;
    public readonly databaseSecret: secrets.ISecret;
    public readonly databaseEndpoint: string;

    constructor(scope: Construct, id: string, props: DatabaseStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create KMS key for database encryption
        const encryptionKey = new kms.Key(this, 'DatabaseEncryptionKey', {
            enableKeyRotation: true,
            description: 'KMS key for DocumentDB encryption',
            alias: `${props.config.envName}-documentdb-key`,
        });

        // Generate database credentials
        this.databaseSecret = new secrets.Secret(this, 'DatabaseCredentials', {
            secretName: `${props.config.envName}/fullstack/database/credentials`,
            description: 'DocumentDB credentials',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: props.config.databaseUsername,
                }),
                generateStringKey: 'password',
                passwordLength: 32,
                excludePunctuation: true,
                excludeCharacters: '"@/\\',
            },
        });

        // Create DocumentDB cluster
        this.database = new docdb.DatabaseCluster(this, 'DatabaseCluster', {
            masterUser: {
                username: this.databaseSecret
                    .secretValueFromJson('username')
                    .toString(),
                password: this.databaseSecret.secretValueFromJson('password'),
            },
            instanceType: new ec2.InstanceType(props.config.databaseInstanceType),
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            securityGroup: this.getDatabaseSecurityGroup(props),
            storageEncrypted: true,
            storageEncryptionKey: encryptionKey,
            backup: {
                retention: cdk.Duration.days(props.config.backupRetentionDays),
                preferredWindow: '03:00-04:00', // Daily backup at 3 AM UTC
            },
            deletionProtection: props.config.envName === 'prod',
            removalPolicy: props.config.envName === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
            preferredMaintenanceWindow: 'sun:04:00-sun:05:00',
            engineVersion: '5.0.0',
            instances: props.config.envName === 'prod' ? 3 : 2,
            dbClusterName: `${props.config.envName}-fullstack-db`,
        });

        // Configure auto-scaling for instances
        const cfnCluster = this.database.node.defaultChild as docdb.CfnDBCluster;
        cfnCluster.scalingConfiguration = {
            minCapacity: 2,
            maxCapacity: props.config.envName === 'prod' ? 16 : 8,
            autoPause: false,
        };

        // Enable CloudWatch logs
        this.database.enableCloudWatchLogsExports([
            'profiler',
            'audit',
        ]);

        // Setup AWS Backup
        if (props.config.envName === 'prod') {
            this.setupBackupPlan();
        }

        this.databaseEndpoint = this.database.clusterEndpoint.hostname;

        // Outputs
        new cdk.CfnOutput(this, 'DatabaseClusterEndpoint', {
            value: this.database.clusterEndpoint.hostname,
            description: 'DocumentDB Cluster Endpoint',
        });

        new cdk.CfnOutput(this, 'DatabasePort', {
            value: this.database.clusterEndpoint.port.toString(),
            description: 'DocumentDB Port',
        });

        new cdk.CfnOutput(this, 'DatabaseSecretArn', {
            value: this.databaseSecret.secretArn,
            description: 'Database Credentials Secret ARN',
        });
    }

    private getDatabaseSecurityGroup(props: DatabaseStackProps): ec2.SecurityGroup {
        const sg = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: props.vpc,
            description: 'Security group for DocumentDB cluster',
            allowAllOutbound: false,
        });

        // Allow traffic from backend services on MongoDB port
        sg.addIngressRule(
            ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
            ec2.Port.tcp(props.config.databasePort),
            'Allow MongoDB access from within VPC'
        );

        return sg;
    }

    private setupBackupPlan(): void {
        // Create backup vault with encryption
        const backupVault = new backups.BackupVault(this, 'BackupVault', {
            backupVaultName: `${this.stackName}-vault`,
            encryptionKey: new kms.Key(this, 'BackupVaultKey', {
                enableKeyRotation: true,
            }),
        });

        // Create backup plan
        const backupPlan = new backups.BackupPlan(this, 'BackupPlan', {
            backupPlanName: `${this.stackName}-plan`,
            backupPlanRules: [
                new backups.BackupPlanRule({
                    ruleName: 'DailyBackup',
                    scheduleExpression: backups.Schedule.cron({
                        hour: '2',
                        minute: '0',
                    }),
                    deleteAfter: cdk.Duration.days(35),
                    moveToColdStorageAfter: cdk.Duration.days(7),
                    backupVault,
                }),
                new backups.BackupPlanRule({
                    ruleName: 'WeeklyBackup',
                    scheduleExpression: backups.Schedule.cron({
                        weekDay: 'SUN',
                        hour: '3',
                        minute: '0',
                    }),
                    deleteAfter: cdk.Duration.days(90),
                    moveToColdStorageAfter: cdk.Duration.days(30),
                    backupVault,
                }),
                new backups.BackupPlanRule({
                    ruleName: 'MonthlyBackup',
                    scheduleExpression: backups.Schedule.cron({
                        day: '1',
                        hour: '4',
                        minute: '0',
                    }),
                    deleteAfter: cdk.Duration.days(365),
                    moveToColdStorageAfter: cdk.Duration.days(90),
                    backupVault,
                }),
            ],
        });

        // Add DocumentDB to backup plan
        backupPlan.addSelection('DatabaseBackupSelection', {
            resources: [
                backups.BackupResource.fromArn(this.database.clusterArn),
            ],
        });
    }
}