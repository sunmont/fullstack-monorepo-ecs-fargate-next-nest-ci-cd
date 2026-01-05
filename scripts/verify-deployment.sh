#!/bin/bash

set -e

echo "Verifying deployment..."

# Check AWS CLI is configured
aws sts get-caller-identity

# Check CDK stacks
cd infra
pnpm run synth

# Check Docker images
docker build -t fullstack-backend:test -f ../apps/backend/Dockerfile ..
docker build -t fullstack-frontend:test -f ../apps/frontend/Dockerfile ..

# Run tests
cd ..
pnpm test
pnpm run type-check
pnpm lint

# Security checks
npm audit
pnpm audit

# Build applications
pnpm build

echo "✅ All checks passed! Deployment is ready."