#!/bin/bash

# Setup AWS credentials
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

# Setup CDK
export CDK_DEFAULT_ACCOUNT="123456789012"
export CDK_DEFAULT_REGION="us-east-1"

# Setup LocalStack (for local development)
export USE_LOCALSTACK="false"
export LOCALSTACK_ENDPOINT="http://localhost:4566"

# SonarQube
export SONAR_TOKEN="your-sonarqube-token"
export SONAR_HOST_URL="http://localhost:9000"

# Application
export NODE_ENV="development"
export MONGODB_URI="mongodb://localhost:27017/fullstack"
export JWT_SECRET="development-secret-change-in-production"

# Create required directories
mkdir -p logs coverage dist

echo "Environment setup completed!"