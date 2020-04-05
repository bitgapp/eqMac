#!/bin/sh
set -e

if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Need to set DOCKER_REGISTRY"
    exit 1
fi  

docker build --no-cache -t $DOCKER_REGISTRY/site:latest .
docker push $DOCKER_REGISTRY/site:latest

gcloud beta run deploy site \
--image $DOCKER_REGISTRY/site:latest \
--allow-unauthenticated \
--platform=managed \
--region=europe-west1
