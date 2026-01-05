import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as docdb from 'aws-cdk-lib/aws-docdb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface MonitoringStackProps extends cdk.StackProps {
    config: StackConfig;
    backendService: ecs.FargateService;
    frontendService: ecs.FargateService;
    database: docdb.DatabaseCluster;
    tags?: { [key: string]: string };
}

export class MonitoringStack extends cdk.Stack {
    private readonly alarmTopic: sns.Topic;
    private readonly dashboard: cloudwatch.Dashboard;

    constructor(scope: Construct, id: string, props: MonitoringStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create SNS topic for alarms
        this.alarmTopic = new sns.Topic(this, 'AlarmTopic', {
            displayName: `${props.config.envName}-fullstack-alarms`,
            topicName: `${props.config.envName}-fullstack-alarms`,
        });

        // Subscribe to alarms
        if (props.config.alarmEmail) {
            this.alarmTopic.addSubscription(
                new subscriptions.EmailSubscription(props.config.alarmEmail)
            );
        }

        if (props.config.alarmPhone) {
            this.alarmTopic.addSubscription(
                new subscriptions.SmsSubscription(props.config.alarmPhone)
            );
        }

        // Create CloudWatch dashboard
        this.dashboard = new cloudwatch.Dashboard(this, 'FullstackDashboard', {
            dashboardName: `${props.config.envName}-fullstack-dashboard`,
        });

        // Setup monitoring for backend
        this.setupBackendMonitoring(props);

        // Setup monitoring for frontend
        this.setupFrontendMonitoring(props);

        // Setup monitoring for database
        this.setupDatabaseMonitoring(props);

        // Setup synthetic monitoring
        this.setupSyntheticMonitoring(props);

        // Outputs
        new cdk.CfnOutput(this, 'CloudWatchDashboardUrl', {
            value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${this.dashboard.dashboardName}`,
            description: 'CloudWatch Dashboard URL',
        });

        new cdk.CfnOutput(this, 'AlarmTopicArn', {
            value: this.alarmTopic.topicArn,
            description: 'SNS Alarm Topic ARN',
        });
    }

    private setupBackendMonitoring(props: MonitoringStackProps): void {
        // CPU Utilization alarm
        const backendCpuAlarm = new cloudwatch.Alarm(this, 'BackendCpuAlarm', {
            alarmName: `${props.config.envName}-backend-cpu-high`,
            metric: props.backendService.metricCpuUtilization(),
            threshold: 80,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        backendCpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Memory Utilization alarm
        const backendMemoryAlarm = new cloudwatch.Alarm(this, 'BackendMemoryAlarm', {
            alarmName: `${props.config.envName}-backend-memory-high`,
            metric: props.backendService.metricMemoryUtilization(),
            threshold: 85,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        backendMemoryAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Healthy host count alarm
        const backendHealthyHostsAlarm = new cloudwatch.Alarm(
            this,
            'BackendHealthyHostsAlarm',
            {
                alarmName: `${props.config.envName}-backend-healthy-hosts-low`,
                metric: new cloudwatch.Metric({
                    namespace: 'AWS/ApplicationELB',
                    metricName: 'HealthyHostCount',
                    dimensionsMap: {
                        LoadBalancer: props.backendService.loadBalancer!.loadBalancerFullName!,
                        TargetGroup: props.backendService.targetGroup.targetGroupFullName!,
                    },
                    statistic: 'Average',
                    period: cdk.Duration.minutes(1),
                }),
                threshold: 1,
                evaluationPeriods: 2,
                datapointsToAlarm: 2,
                comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
                treatMissingData: cloudwatch.TreatMissingData.BREACHING,
            }
        );

        backendHealthyHostsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Add backend metrics to dashboard
        this.dashboard.addWidgets(
            new cloudwatch.GraphWidget({
                title: 'Backend CPU Utilization',
                left: [props.backendService.metricCpuUtilization()],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'Backend Memory Utilization',
                left: [props.backendService.metricMemoryUtilization()],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'Backend HTTP 5xx Errors',
                left: [
                    new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'HTTPCode_Target_5XX_Count',
                        dimensionsMap: {
                            LoadBalancer: props.backendService.loadBalancer!.loadBalancerFullName!,
                        },
                        statistic: 'Sum',
                        period: cdk.Duration.minutes(1),
                    }),
                ],
                stacked: false,
                width: 12,
            })
        );
    }

    private setupFrontendMonitoring(props: MonitoringStackProps): void {
        // Frontend CPU alarm
        const frontendCpuAlarm = new cloudwatch.Alarm(this, 'FrontendCpuAlarm', {
            alarmName: `${props.config.envName}-frontend-cpu-high`,
            metric: props.frontendService.metricCpuUtilization(),
            threshold: 80,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        frontendCpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Frontend memory alarm
        const frontendMemoryAlarm = new cloudwatch.Alarm(this, 'FrontendMemoryAlarm', {
            alarmName: `${props.config.envName}-frontend-memory-high`,
            metric: props.frontendService.metricMemoryUtilization(),
            threshold: 85,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        frontendMemoryAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // CloudFront metrics
        const cloudFront4xxAlarm = new cloudwatch.Alarm(this, 'CloudFront4xxAlarm', {
            alarmName: `${props.config.envName}-cloudfront-4xx-high`,
            metric: new cloudwatch.Metric({
                namespace: 'AWS/CloudFront',
                metricName: '4xxErrorRate',
                dimensionsMap: {
                    DistributionId: 'YOUR_DISTRIBUTION_ID', // Replace with actual ID
                    Region: 'Global',
                },
                statistic: 'Average',
                period: cdk.Duration.minutes(5),
            }),
            threshold: 5, // 5% error rate
            evaluationPeriods: 2,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });

        cloudFront4xxAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Add frontend metrics to dashboard
        this.dashboard.addWidgets(
            new cloudwatch.GraphWidget({
                title: 'Frontend CPU Utilization',
                left: [props.frontendService.metricCpuUtilization()],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'Frontend Memory Utilization',
                left: [props.frontendService.metricMemoryUtilization()],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'CloudFront Requests',
                left: [
                    new cloudwatch.Metric({
                        namespace: 'AWS/CloudFront',
                        metricName: 'Requests',
                        dimensionsMap: {
                            DistributionId: 'YOUR_DISTRIBUTION_ID',
                            Region: 'Global',
                        },
                        statistic: 'Sum',
                        period: cdk.Duration.minutes(5),
                    }),
                ],
                stacked: false,
                width: 12,
            })
        );
    }

    private setupDatabaseMonitoring(props: MonitoringStackProps): void {
        // Database CPU alarm
        const databaseCpuAlarm = new cloudwatch.Alarm(this, 'DatabaseCpuAlarm', {
            alarmName: `${props.config.envName}-database-cpu-high`,
            metric: new cloudwatch.Metric({
                namespace: 'AWS/DocDB',
                metricName: 'CPUUtilization',
                dimensionsMap: {
                    DBClusterIdentifier: props.database.clusterIdentifier,
                },
                statistic: 'Average',
                period: cdk.Duration.minutes(5),
            }),
            threshold: 80,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        databaseCpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Database connections alarm
        const databaseConnectionsAlarm = new cloudwatch.Alarm(
            this,
            'DatabaseConnectionsAlarm',
            {
                alarmName: `${props.config.envName}-database-connections-high`,
                metric: new cloudwatch.Metric({
                    namespace: 'AWS/DocDB',
                    metricName: 'DatabaseConnections',
                    dimensionsMap: {
                        DBClusterIdentifier: props.database.clusterIdentifier,
                    },
                    statistic: 'Average',
                    period: cdk.Duration.minutes(5),
                }),
                threshold: 1000,
                evaluationPeriods: 2,
                datapointsToAlarm: 2,
                comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                treatMissingData: cloudwatch.TreatMissingData.BREACHING,
            }
        );

        databaseConnectionsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Add database metrics to dashboard
        this.dashboard.addWidgets(
            new cloudwatch.GraphWidget({
                title: 'Database CPU Utilization',
                left: [
                    new cloudwatch.Metric({
                        namespace: 'AWS/DocDB',
                        metricName: 'CPUUtilization',
                        dimensionsMap: {
                            DBClusterIdentifier: props.database.clusterIdentifier,
                        },
                        statistic: 'Average',
                        period: cdk.Duration.minutes(5),
                    }),
                ],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'Database Connections',
                left: [
                    new cloudwatch.Metric({
                        namespace: 'AWS/DocDB',
                        metricName: 'DatabaseConnections',
                        dimensionsMap: {
                            DBClusterIdentifier: props.database.clusterIdentifier,
                        },
                        statistic: 'Average',
                        period: cdk.Duration.minutes(5),
                    }),
                ],
                stacked: false,
                width: 12,
            }),
            new cloudwatch.GraphWidget({
                title: 'Database Storage',
                left: [
                    new cloudwatch.Metric({
                        namespace: 'AWS/DocDB',
                        metricName: 'VolumeBytesUsed',
                        dimensionsMap: {
                            DBClusterIdentifier: props.database.clusterIdentifier,
                        },
                        statistic: 'Average',
                        period: cdk.Duration.minutes(5),
                    }),
                ],
                stacked: false,
                width: 12,
            })
        );
    }

    private setupSyntheticMonitoring(props: MonitoringStackProps): void {
        // Create canary for API health check
        // Note: In a real implementation, you would use CloudWatch Synthetics
        // This is a simplified version for demonstration

        const apiHealthAlarm = new cloudwatch.Alarm(this, 'ApiHealthAlarm', {
            alarmName: `${props.config.envName}-api-health-check`,
            metric: new cloudwatch.Metric({
                namespace: 'Custom/Fullstack',
                metricName: 'ApiHealth',
                statistic: 'Average',
                period: cdk.Duration.minutes(1),
            }),
            threshold: 1,
            evaluationPeriods: 2,
            datapointsToAlarm: 2,
            comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });

        apiHealthAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.alarmTopic));

        // Add synthetic monitoring to dashboard
        this.dashboard.addWidgets(
            new cloudwatch.SingleValueWidget({
                title: 'Synthetic Monitoring',
                metrics: [
                    new cloudwatch.Metric({
                        namespace: 'Custom/Fullstack',
                        metricName: 'ApiResponseTime',
                        statistic: 'p99',
                        period: cdk.Duration.minutes(5),
                        label: 'API P99 Response Time (ms)',
                    }),
                    new cloudwatch.Metric({
                        namespace: 'Custom/Fullstack',
                        metricName: 'ApiAvailability',
                        statistic: 'Average',
                        period: cdk.Duration.minutes(5),
                        label: 'API Availability (%)',
                    }),
                ],
                width: 24,
            })
        );
    }
}