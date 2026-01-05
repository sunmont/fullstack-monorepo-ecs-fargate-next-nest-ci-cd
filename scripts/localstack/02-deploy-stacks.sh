#!/bin/bash

echo "Deploying CDK stacks to LocalStack..."

# Bootstrap CDK for LocalStack
cdklocal bootstrap aws://000000000000/us-east-1

# Deploy stacks
cdklocal deploy --all --require-approval never

echo "Deployment completed!"