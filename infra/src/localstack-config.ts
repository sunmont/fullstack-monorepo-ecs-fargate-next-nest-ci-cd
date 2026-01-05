import * as cdk from 'aws-cdk-lib';

export class LocalStackConfig {
    static getConfig(): cdk.StackProps {
        return {
            env: {
                account: '000000000000',
                region: 'us-east-1',
            },
            synthesizer: new cdk.DefaultStackSynthesizer({
                fileAssetsBucketName: 'cdk.local.assets',
                bucketPrefix: '',
                dockerTagPrefix: '',
            }),
        };
    }

    static getEndpoint(service: string): string {
        return process.env.LOCALSTACK_ENDPOINT
            ? `${process.env.LOCALSTACK_ENDPOINT}/${service}`
            : `http://localhost:4566/${service}`;
    }

    static isLocalStack(): boolean {
        return process.env.USE_LOCALSTACK === 'true';
    }
}