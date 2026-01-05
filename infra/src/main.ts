#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from './stacks/network-stack';
import { DatabaseStack } from './stacks/database-stack';
import { BackendStack } from './stacks/backend-stack';
import { FrontendStack } from './stacks/frontend-stack';
import { PipelineStack } from './stacks/pipeline-stack';
import { MonitoringStack } from './stacks/monitoring-stack';
import { Config } from './config';

const app = new cdk.App();

// Get environment from context or default to dev
const envName = app.node.tryGetContext('env') || 'dev';
const config = Config.getConfig(envName);

// AWS Account and Region
const env: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT || config.account,
    region: process.env.CDK_DEFAULT_REGION || config.region,
};

// Create a unique identifier for the stack
const appName = 'fullstack-monorepo';
const stackPrefix = `${appName}-${envName}`;

// Tags for all resources
const tags = {
    Environment: envName,
    Application: appName,
    ManagedBy: 'CDK',
    Owner: 'DevOps',
};

// Network Stack (VPC, Subnets, Security Groups)
const networkStack = new NetworkStack(app, `${stackPrefix}-network`, {
    env,
    config,
    tags,
});

// Database Stack (MongoDB Atlas or DocumentDB)
const databaseStack = new DatabaseStack(app, `${stackPrefix}-database`, {
    env,
    config,
    vpc: networkStack.vpc,
    tags,
});

// Backend Stack (ECS Fargate + ALB)
const backendStack = new BackendStack(app, `${stackPrefix}-backend`, {
    env,
    config,
    vpc: networkStack.vpc,
    databaseSecret: databaseStack.databaseSecret,
    tags,
});

// Frontend Stack (ECS Fargate + CloudFront)
const frontendStack = new FrontendStack(app, `${stackPrefix}-frontend`, {
    env,
    config,
    vpc: networkStack.vpc,
    backendUrl: backendStack.backendUrl,
    tags,
});

// Monitoring Stack (CloudWatch, SNS, Dashboards)
const monitoringStack = new MonitoringStack(app, `${stackPrefix}-monitoring`, {
    env,
    config,
    backendService: backendStack.service,
    frontendService: frontendStack.service,
    database: databaseStack.database,
    tags,
});

// Pipeline Stack (CI/CD with SonarQube)
const pipelineStack = new PipelineStack(app, `${stackPrefix}-pipeline`, {
    env,
    config,
    repositoryName: 'fullstack-monorepo',
    backendService: backendStack.service,
    frontendService: frontendStack.service,
    tags,
});

// Add dependencies
backendStack.addDependency(databaseStack);
frontendStack.addDependency(backendStack);
monitoringStack.addDependency(backendStack);
monitoringStack.addDependency(frontendStack);
pipelineStack.addDependency(backendStack);
pipelineStack.addDependency(frontendStack);

// Outputs
new cdk.CfnOutput(backendStack, 'BackendUrl', {
    value: backendStack.backendUrl,
    description: 'Backend API URL',
});

new cdk.CfnOutput(frontendStack, 'FrontendUrl', {
    value: frontendStack.frontendUrl,
    description: 'Frontend Application URL',
});

new cdk.CfnOutput(databaseStack, 'DatabaseEndpoint', {
    value: databaseStack.databaseEndpoint,
    description: 'Database Connection Endpoint',
});

new cdk.CfnOutput(pipelineStack, 'PipelineUrl', {
    value: pipelineStack.pipelineUrl,
    description: 'CodePipeline URL',
});