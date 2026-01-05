import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { StackConfig } from '../config';

interface PipelineStackProps extends cdk.StackProps {
    config: StackConfig;
    repositoryName: string;
    backendService: ecs.FargateService;
    frontendService: ecs.FargateService;
    tags?: { [key: string]: string };
}

export class PipelineStack extends cdk.Stack {
    public readonly pipelineUrl: string;
    private readonly pipeline: codepipeline.Pipeline;
    private readonly sourceOutput: codepipeline.Artifact;
    private readonly buildOutput: codepipeline.Artifact;

    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        // Apply tags
        Object.entries(props.tags || {}).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });

        // Create S3 bucket for pipeline artifacts
        const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
            bucketName: `${props.config.envName}-${props.config.account}-pipeline-artifacts`,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            versioned: true,
            lifecycleRules: [
                {
                    expiration: cdk.Duration.days(30),
                    prefix: 'artifacts/',
                },
            ],
        });

        // Create pipeline
        this.pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
            pipelineName: `${props.config.envName}-fullstack-pipeline`,
            artifactBucket,
            restartExecutionOnUpdate: true,
        });

        // Source stage (GitHub)
        const sourceStage = this.createSourceStage(props);

        // Build and test stage
        const buildStage = this.createBuildStage(props);

        // Security scan stage
        const securityStage = this.createSecurityStage(props);

        // Deploy stages
        const deployStages = this.createDeployStages(props);

        // Assemble pipeline
        this.pipeline.addStage({
            stageName: 'Source',
            actions: [sourceStage.action],
        });

        this.pipeline.addStage({
            stageName: 'Build-Test',
            actions: [buildStage.action],
        });

        this.pipeline.addStage({
            stageName: 'Security-Scan',
            actions: securityStage.actions,
        });

        deployStages.forEach((deployStage, index) => {
            this.pipeline.addStage({
                stageName: `Deploy-${deployStage.name}`,
                actions: [deployStage.action],
            });
        });

        this.pipelineUrl = `https://${this.region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${this.pipeline.pipelineName}/view`;

        // Outputs
        new cdk.CfnOutput(this, 'PipelineName', {
            value: this.pipeline.pipelineName,
            description: 'CodePipeline Name',
        });

        new cdk.CfnOutput(this, 'PipelineConsoleUrl', {
            value: this.pipelineUrl,
            description: 'CodePipeline Console URL',
        });
    }

    private createSourceStage(props: PipelineStackProps): {
        artifact: codepipeline.Artifact;
        action: codepipeline.IAction;
    } {
        this.sourceOutput = new codepipeline.Artifact('SourceOutput');

        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub_Source',
            owner: props.config.repositoryOwner,
            repo: props.repositoryName,
            branch: props.config.branchName,
            oauthToken: cdk.SecretValue.secretsManager('github-token'),
            output: this.sourceOutput,
            trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        });

        return {
            artifact: this.sourceOutput,
            action: sourceAction,
        };
    }

    private createBuildStage(props: PipelineStackProps): {
        artifact: codepipeline.Artifact;
        action: codepipeline.IAction;
    } {
        this.buildOutput = new codepipeline.Artifact('BuildOutput');

        const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
            projectName: `${props.config.envName}-fullstack-build`,
            description: 'Build and test the fullstack application',
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                privileged: true,
                computeType: codebuild.ComputeType.MEDIUM,
                environmentVariables: {
                    SONAR_TOKEN: {
                        value: props.config.sonarToken,
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    SONAR_HOST_URL: {
                        value: props.config.sonarHostUrl,
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                },
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        'runtime-versions': {
                            nodejs: '18',
                        },
                        commands: [
                            'echo "Installing dependencies..."',
                            'npm install -g pnpm turbo',
                            'pnpm install',
                        ],
                    },
                    pre_build: {
                        commands: [
                            'echo "Running linting and type checking..."',
                            'pnpm lint',
                            'pnpm type-check',
                        ],
                    },
                    build: {
                        commands: [
                            'echo "Building application..."',
                            'pnpm build',
                        ],
                    },
                    post_build: {
                        commands: [
                            'echo "Running tests..."',
                            'pnpm test',
                            'echo "Running security checks..."',
                            'pnpm audit',
                        ],
                    },
                },
                artifacts: {
                    'base-directory': '.',
                    files: ['**/*'],
                    'exclude-paths': ['node_modules', '.next'],
                },
                cache: {
                    paths: ['node_modules/**/*', '.next/cache/**/*'],
                },
            }),
            timeout: cdk.Duration.hours(1),
            cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM),
        });

        // Grant necessary permissions
        buildProject.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ['ecr:GetAuthorizationToken', 'ecr:BatchCheckLayerAvailability'],
                resources: ['*'],
            })
        );

        const buildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Build_And_Test',
            project: buildProject,
            input: this.sourceOutput,
            outputs: [this.buildOutput],
            executeBatchBuild: false,
            type: codepipeline_actions.CodeBuildActionType.BUILD,
        });

        return {
            artifact: this.buildOutput,
            action: buildAction,
        };
    }

    private createSecurityStage(props: PipelineStackProps): {
        actions: codepipeline.IAction[];
    } {
        // SonarQube scan
        const sonarProject = new codebuild.PipelineProject(this, 'SonarQubeProject', {
            projectName: `${props.config.envName}-sonarqube-scan`,
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                computeType: codebuild.ComputeType.MEDIUM,
                privileged: false,
                environmentVariables: {
                    SONAR_TOKEN: {
                        value: props.config.sonarToken,
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                    SONAR_HOST_URL: {
                        value: props.config.sonarHostUrl,
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    },
                },
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'echo "Installing SonarScanner..."',
                            'wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip',
                            'unzip sonar-scanner-cli-5.0.1.3006-linux.zip',
                            'mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner',
                        ],
                    },
                    build: {
                        commands: [
                            'echo "Running SonarQube analysis..."',
                            'export PATH=$PATH:/opt/sonar-scanner/bin',
                            'sonar-scanner \
                              -Dsonar.projectKey=fullstack-monorepo \
                              -Dsonar.projectName="FullStack Monorepo" \
                              -Dsonar.projectVersion=1.0 \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=node_modules/**,dist/**,coverage/**,**/*.test.ts,**/*.spec.ts \
                              -Dsonar.tests=. \
                              -Dsonar.test.inclusions=**/*.test.ts,**/*.spec.ts \
                              -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.testExecutionReportPaths=test-report.xml \
                              -Dsonar.qualitygate.wait=true',
                        ],
                    },
                },
                reports: {
                    sonarqube: {
                        files: ['sonar-report.json'],
                        'base-directory': '.',
                        'file-format': 'SONARQUBE_JSON',
                    },
                },
            }),
        });

        // OWASP Dependency Check
        const dependencyCheckProject = new codebuild.PipelineProject(
            this,
            'DependencyCheckProject',
            {
                projectName: `${props.config.envName}-dependency-check`,
                environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                    computeType: codebuild.ComputeType.MEDIUM,
                    privileged: true,
                },
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        install: {
                            commands: [
                                'echo "Installing OWASP Dependency Check..."',
                                'wget https://github.com/jeremylong/DependencyCheck/releases/download/v9.0.7/dependency-check-9.0.7-release.zip',
                                'unzip dependency-check-9.0.7-release.zip',
                                'mv dependency-check /opt/dependency-check',
                            ],
                        },
                        build: {
                            commands: [
                                'echo "Running dependency vulnerability scan..."',
                                '/opt/dependency-check/bin/dependency-check.sh \
                                  --project "FullStack Monorepo" \
                                  --scan . \
                                  --out . \
                                  --format HTML \
                                  --format JSON \
                                  --enableExperimental \
                                  --failOnCVSS 7',
                            ],
                        },
                    },
                    artifacts: {
                        files: ['dependency-check-report.html', 'dependency-check-report.json'],
                        'base-directory': '.',
                    },
                }),
            }
        );

        const sonarAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'SonarQube_Scan',
            project: sonarProject,
            input: this.buildOutput,
            type: codepipeline_actions.CodeBuildActionType.TEST,
        });

        const dependencyCheckAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Dependency_Check',
            project: dependencyCheckProject,
            input: this.buildOutput,
            type: codepipeline_actions.CodeBuildActionType.TEST,
        });

        return {
            actions: [sonarAction, dependencyCheckAction],
        };
    }

    private createDeployStages(props: PipelineStackProps): Array<{
        name: string;
        action: codepipeline.IAction;
    }> {
        // Backend deployment
        const backendDeployProject = new codebuild.PipelineProject(
            this,
            'BackendDeployProject',
            {
                projectName: `${props.config.envName}-backend-deploy`,
                environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                    computeType: codebuild.ComputeType.MEDIUM,
                    privileged: true,
                    environmentVariables: {
                        AWS_DEFAULT_REGION: { value: props.config.region },
                        AWS_ACCOUNT_ID: { value: props.config.account },
                        ECR_REPOSITORY_URI: {
                            value: `$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/${props.config.envName}/fullstack/backend`,
                        },
                        ECS_SERVICE: { value: props.backendService.serviceName },
                        ECS_CLUSTER: { value: props.backendService.cluster.clusterName },
                        DOCKER_BUILDKIT: { value: '1' },
                    },
                },
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        pre_build: {
                            commands: [
                                'echo "Logging in to Amazon ECR..."',
                                'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com',
                                'echo "Building Docker image..."',
                            ],
                        },
                        build: {
                            commands: [
                                'cd apps/backend',
                                'docker build -t $ECR_REPOSITORY_URI:latest .',
                                'docker tag $ECR_REPOSITORY_URI:latest $ECR_REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                            ],
                        },
                        post_build: {
                            commands: [
                                'echo "Pushing Docker image to ECR..."',
                                'docker push $ECR_REPOSITORY_URI:latest',
                                'docker push $ECR_REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                                'echo "Updating ECS service..."',
                                'aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment',
                                'echo "Backend deployment completed successfully."',
                            ],
                        },
                    },
                }),
            }
        );

        // Frontend deployment
        const frontendDeployProject = new codebuild.PipelineProject(
            this,
            'FrontendDeployProject',
            {
                projectName: `${props.config.envName}-frontend-deploy`,
                environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                    computeType: codebuild.ComputeType.MEDIUM,
                    privileged: true,
                    environmentVariables: {
                        AWS_DEFAULT_REGION: { value: props.config.region },
                        AWS_ACCOUNT_ID: { value: props.config.account },
                        ECR_REPOSITORY_URI: {
                            value: `$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/${props.config.envName}/fullstack/frontend`,
                        },
                        ECS_SERVICE: { value: props.frontendService.serviceName },
                        ECS_CLUSTER: { value: props.frontendService.cluster.clusterName },
                        NEXT_PUBLIC_API_URL: { value: `https://api-${props.config.envName}.example.com` },
                    },
                },
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        pre_build: {
                            commands: [
                                'echo "Logging in to Amazon ECR..."',
                                'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com',
                                'echo "Setting up environment variables..."',
                                'cd apps/frontend',
                                'echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.production',
                            ],
                        },
                        build: {
                            commands: [
                                'echo "Building frontend..."',
                                'cd apps/frontend',
                                'docker build -t $ECR_REPOSITORY_URI:latest .',
                                'docker tag $ECR_REPOSITORY_URI:latest $ECR_REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                            ],
                        },
                        post_build: {
                            commands: [
                                'echo "Pushing Docker image to ECR..."',
                                'docker push $ECR_REPOSITORY_URI:latest',
                                'docker push $ECR_REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                                'echo "Updating ECS service..."',
                                'aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment',
                                'echo "Frontend deployment completed successfully."',
                            ],
                        },
                    },
                }),
            }
        );

        // Grant deployment permissions
        const deployPolicy = new iam.PolicyStatement({
            actions: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:GetRepositoryPolicy',
                'ecr:DescribeRepositories',
                'ecr:ListImages',
                'ecr:DescribeImages',
                'ecr:BatchGetImage',
                'ecr:InitiateLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:CompleteLayerUpload',
                'ecr:PutImage',
                'ecs:UpdateService',
                'ecs:DescribeServices',
                'ecs:DescribeTaskDefinition',
            ],
            resources: ['*'],
        });

        backendDeployProject.addToRolePolicy(deployPolicy);
        frontendDeployProject.addToRolePolicy(deployPolicy);

        const backendDeployAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Deploy_Backend',
            project: backendDeployProject,
            input: this.buildOutput,
            type: codepipeline_actions.CodeBuildActionType.BUILD,
        });

        const frontendDeployAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Deploy_Frontend',
            project: frontendDeployProject,
            input: this.buildOutput,
            type: codepipeline_actions.CodeBuildActionType.BUILD,
        });

        return [
            { name: 'Backend', action: backendDeployAction },
            { name: 'Frontend', action: frontendDeployAction },
        ];
    }
}