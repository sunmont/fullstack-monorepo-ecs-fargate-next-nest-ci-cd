import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface NetworkStackProps extends cdk.StackProps {
    config: StackConfig;
    tags?: { [key: string]: string };
}

export class NetworkStack extends cdk.Stack {
    public readonly vpc: ec2.Vpc;
    public readonly backendSecurityGroup: ec2.SecurityGroup;
    public readonly frontendSecurityGroup: ec2.SecurityGroup;
    public readonly databaseSecurityGroup: ec2.SecurityGroup;

    constructor(scope: Construct, id: string, props: NetworkStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create VPC with public and private subnets
        this.vpc = new ec2.Vpc(this, 'Vpc', {
            ipAddresses: ec2.IpAddresses.cidr(props.config.vpcCidr),
            maxAzs: 3, // Use 3 Availability Zones
            subnetConfiguration: [
                {
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                    cidrMask: 24,
                },
                {
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24,
                },
                {
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24,
                },
            ],
            natGateways: props.config.envName === 'prod' ? 3 : 1,
            enableDnsHostnames: true,
            enableDnsSupport: true,
        });

        // Security Group for Backend
        this.backendSecurityGroup = new ec2.SecurityGroup(this, 'BackendSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for backend ECS service',
            allowAllOutbound: true,
        });

        this.backendSecurityGroup.addIngressRule(
            ec2.Peer.ipv4(props.config.allowedCidr),
            ec2.Port.tcp(3000),
            'Allow HTTP traffic from anywhere'
        );

        this.backendSecurityGroup.addIngressRule(
            this.backendSecurityGroup,
            ec2.Port.allTraffic(),
            'Allow all traffic within security group'
        );

        // Security Group for Frontend
        this.frontendSecurityGroup = new ec2.SecurityGroup(this, 'FrontendSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for frontend ECS service',
            allowAllOutbound: true,
        });

        this.frontendSecurityGroup.addIngressRule(
            ec2.Peer.ipv4(props.config.allowedCidr),
            ec2.Port.tcp(3000),
            'Allow HTTP traffic from anywhere'
        );

        this.frontendSecurityGroup.addIngressRule(
            ec2.Peer.ipv4(props.config.allowedCidr),
            ec2.Port.tcp(443),
            'Allow HTTPS traffic from anywhere'
        );

        // Security Group for Database
        this.databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for MongoDB',
            allowAllOutbound: true,
        });

        // Only allow database access from backend services
        this.databaseSecurityGroup.addIngressRule(
            this.backendSecurityGroup,
            ec2.Port.tcp(props.config.databasePort),
            'Allow MongoDB access from backend services'
        );

        // Outputs
        new cdk.CfnOutput(this, 'VpcId', {
            value: this.vpc.vpcId,
            description: 'VPC ID',
        });

        new cdk.CfnOutput(this, 'VpcCidr', {
            value: this.vpc.vpcCidrBlock,
            description: 'VPC CIDR',
        });
    }
}