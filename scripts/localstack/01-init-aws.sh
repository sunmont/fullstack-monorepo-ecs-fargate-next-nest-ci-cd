#!/bin/bash

echo "Initializing LocalStack resources..."

# Create S3 buckets
awslocal s3 mb s3://dev-fullstack-frontend
awslocal s3 mb s3://dev-pipeline-artifacts

# Create ECR repositories
awslocal ecr create-repository --repository-name dev/fullstack/backend
awslocal ecr create-repository --repository-name dev/fullstack/frontend

# Create secrets
awslocal secretsmanager create-secret \
  --name dev/fullstack/database/credentials \
  --secret-string '{"username":"admin","password":"localdev123","host":"localhost","port":27017}'

awslocal secretsmanager create-secret \
  --name github-token \
  --secret-string '{"token":"dummy-github-token"}'

# Create IAM roles
awslocal iam create-role \
  --role-name EcsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

awslocal iam attach-role-policy \
  --role-name EcsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Create CodeBuild project
awslocal codebuild create-project \
  --name dev-fullstack-build \
  --source '{
    "type": "CODEPIPELINE",
    "buildspec": "buildspec.yml"
  }' \
  --environment '{
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/standard:7.0",
    "computeType": "BUILD_GENERAL1_MEDIUM"
  }' \
  --service-role EcsTaskExecutionRole

echo "LocalStack initialization completed!"