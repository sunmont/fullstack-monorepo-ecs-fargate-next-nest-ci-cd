import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface LogExporterProps {
    logGroups: logs.LogGroup[];
    bucket: s3.Bucket;
    prefix?: string;
    bufferInterval?: cdk.Duration;
    bufferSize?: number;
}

export class LogExporter extends Construct {
    constructor(scope: Construct, id: string, props: LogExporterProps) {
        super(scope, id);

        // Create Kinesis Data Stream
        const stream = new kinesis.Stream(this, 'LogStream', {
            streamName: 'fullstack-logs-stream',
            shardCount: 2,
            retentionPeriod: cdk.Duration.hours(24),
            encryption: kinesis.StreamEncryption.KMS,
        });

        // Create Lambda function for log processing
        const logProcessor = new lambda.Function(this, 'LogProcessor', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          const records = event.records.map(record => {
            const payload = Buffer.from(record.data, 'base64').toString('utf8');
            const logData = JSON.parse(payload);
            
            // Add custom processing here
            logData.processedAt = new Date().toISOString();
            logData.environment = process.env.ENVIRONMENT;
            
            return {
              recordId: record.recordId,
              result: 'Ok',
              data: Buffer.from(JSON.stringify(logData)).toString('base64')
            };
          });
          
          return { records };
        };
      `),
            environment: {
                ENVIRONMENT: 'production',
            },
            timeout: cdk.Duration.seconds(30),
            memorySize: 256,
        });

        // Create Firehose Delivery Stream
        const firehoseRole = new iam.Role(this, 'FirehoseRole', {
            assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
        });

        props.bucket.grantReadWrite(firehoseRole);
        stream.grantRead(firehoseRole);
        logProcessor.grantInvoke(firehoseRole);

        const deliveryStream = new firehose.CfnDeliveryStream(this, 'LogDeliveryStream', {
            deliveryStreamName: 'fullstack-logs-delivery',
            deliveryStreamType: 'KinesisStreamAsSource',
            kinesisStreamSourceConfiguration: {
                kinesisStreamArn: stream.streamArn,
                roleArn: firehoseRole.roleArn,
            },
            extendedS3DestinationConfiguration: {
                bucketArn: props.bucket.bucketArn,
                roleArn: firehoseRole.roleArn,
                prefix: props.prefix || 'logs/',
                errorOutputPrefix: 'errors/',
                bufferingHints: {
                    intervalInSeconds: props.bufferInterval?.toSeconds() || 300,
                    sizeInMBs: props.bufferSize || 5,
                },
                compressionFormat: 'GZIP',
                cloudWatchLoggingOptions: {
                    enabled: true,
                    logGroupName: '/aws/kinesisfirehose/fullstack-logs',
                    logStreamName: 'delivery',
                },
                processingConfiguration: {
                    enabled: true,
                    processors: [
                        {
                            type: 'Lambda',
                            parameters: [
                                {
                                    parameterName: 'LambdaArn',
                                    parameterValue: logProcessor.functionArn,
                                },
                                {
                                    parameterName: 'BufferIntervalInSeconds',
                                    parameterValue: '60',
                                },
                                {
                                    parameterName: 'BufferSizeInMBs',
                                    parameterValue: '3',
                                },
                            ],
                        },
                    ],
                },
            },
        });

        // Subscribe log groups to Kinesis stream
        props.logGroups.forEach((logGroup, index) => {
            new logs.CfnSubscriptionFilter(this, `LogSubscription${index}`, {
                logGroupName: logGroup.logGroupName,
                destinationArn: stream.streamArn,
                filterPattern: '',
                roleArn: this.createSubscriptionRole(stream).roleArn,
            });
        });
    }

    private createSubscriptionRole(stream: kinesis.Stream): iam.Role {
        const role = new iam.Role(this, 'LogSubscriptionRole', {
            assumedBy: new iam.ServicePrincipal('logs.amazonaws.com'),
        });

        role.addToPolicy(
            new iam.PolicyStatement({
                actions: [
                    'kinesis:PutRecord',
                    'kinesis:DescribeStream',
                ],
                resources: [stream.streamArn],
            })
        );

        return role;
    }
}