#!/bin/sh

if [ -z "$GCLOUD_ACCOUNT" ]; then
    echo "Need to set GCLOUD_ACCOUNT"
    exit 0
fi

if [ -z "$GCLOUD_PROJECT" ]; then
    echo "Need to set GCLOUD_PROJECT"
    exit 0
fi

gcloud config set account $GCLOUD_ACCOUNT
gcloud config set project $GCLOUD_PROJECT

gsutil -m -h "Cache-Control:no-cache, max-age=0" cp -z js,css,html -r ./* gs://update.eqmac.app