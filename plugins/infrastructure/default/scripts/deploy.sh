#!/bin/bash

# Deployment script for Next.js Boilerplate
# Usage: ./deploy.sh [environment] [version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
PROJECT_NAME="next-boilerplate"
REGISTRY_URL="your-registry.com"
NAMESPACE="next-boilerplate"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed"
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        error "docker is not installed"
    fi
    
    # Check if helm is installed
    if ! command -v helm &> /dev/null; then
        error "helm is not installed"
    fi
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster"
    fi
    
    success "Prerequisites check passed"
}

# Build and push Docker image
build_and_push() {
    log "Building and pushing Docker image..."
    
    # Build the image
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}:${VERSION} .
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}:latest .
    
    # Push the image
    docker push ${REGISTRY_URL}/${PROJECT_NAME}:${VERSION}
    docker push ${REGISTRY_URL}/${PROJECT_NAME}:latest
    
    success "Docker image built and pushed successfully"
}

# Deploy to Kubernetes
deploy_to_k8s() {
    log "Deploying to Kubernetes..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    # Update image tag in deployment
    sed -i.bak "s|image: .*|image: ${REGISTRY_URL}/${PROJECT_NAME}:${VERSION}|g" k8s/deployment.yaml
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/ -n ${NAMESPACE}
    
    # Wait for deployment to be ready
    kubectl rollout status deployment/${PROJECT_NAME} -n ${NAMESPACE} --timeout=300s
    
    success "Deployment completed successfully"
}

# Deploy with Helm
deploy_with_helm() {
    log "Deploying with Helm..."
    
    # Update Helm values
    helm upgrade --install ${PROJECT_NAME} helm/ \
        --namespace ${NAMESPACE} \
        --set image.tag=${VERSION} \
        --set image.repository=${REGISTRY_URL}/${PROJECT_NAME} \
        --set environment=${ENVIRONMENT} \
        --wait \
        --timeout=300s
    
    success "Helm deployment completed successfully"
}

# Run health checks
health_check() {
    log "Running health checks..."
    
    # Get service URL
    SERVICE_URL=$(kubectl get service ${PROJECT_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ -z "$SERVICE_URL" ]; then
        SERVICE_URL=$(kubectl get service ${PROJECT_NAME} -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
        warning "Using cluster IP for health check: ${SERVICE_URL}"
    fi
    
    # Wait for service to be ready
    log "Waiting for service to be ready..."
    sleep 30
    
    # Check health endpoint
    if curl -f http://${SERVICE_URL}:3000/api/health; then
        success "Health check passed"
    else
        error "Health check failed"
    fi
}

# Rollback deployment
rollback() {
    log "Rolling back deployment..."
    
    if kubectl rollout undo deployment/${PROJECT_NAME} -n ${NAMESPACE}; then
        success "Rollback completed successfully"
    else
        error "Rollback failed"
    fi
}

# Cleanup old images
cleanup() {
    log "Cleaning up old images..."
    
    # Remove old Docker images (keep last 5)
    docker images ${REGISTRY_URL}/${PROJECT_NAME} --format "table {{.Tag}}\t{{.ID}}" | \
        tail -n +2 | \
        head -n -5 | \
        awk '{print $2}' | \
        xargs -r docker rmi || true
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting deployment to ${ENVIRONMENT} environment with version ${VERSION}"
    
    # Check prerequisites
    check_prerequisites
    
    # Build and push image
    build_and_push
    
    # Deploy based on environment
    case ${ENVIRONMENT} in
        "staging"|"production")
            deploy_with_helm
            ;;
        "development")
            deploy_to_k8s
            ;;
        *)
            error "Unknown environment: ${ENVIRONMENT}"
            ;;
    esac
    
    # Run health checks
    health_check
    
    # Cleanup
    cleanup
    
    success "Deployment to ${ENVIRONMENT} completed successfully!"
    
    # Show deployment info
    log "Deployment Information:"
    echo "  Environment: ${ENVIRONMENT}"
    echo "  Version: ${VERSION}"
    echo "  Namespace: ${NAMESPACE}"
    echo "  Image: ${REGISTRY_URL}/${PROJECT_NAME}:${VERSION}"
    
    # Show service URL
    SERVICE_URL=$(kubectl get service ${PROJECT_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    if [ ! -z "$SERVICE_URL" ]; then
        echo "  Service URL: http://${SERVICE_URL}"
    fi
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        main
        ;;
esac
