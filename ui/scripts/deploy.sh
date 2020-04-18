#!/bin/sh
set -e

VERSION=$(node -e "const [ major, minor ] = require('./package.json').version.split('.');console.log([major, minor, 0].join(''))")
DOMAIN=ui-v$VERSION.eqmac.app

npm run build

gcloud config set account $GCLOUD_ACCOUNT
gcloud config set project $GCLOUD_PROJECT_ID

gsutil -m cp -z js,css,html -r dist/* gs://$DOMAIN
gsutil -m setmeta -h "Content-Type:text/html;charset=utf-8" gs://$DOMAIN/**/*.html
gsutil iam ch allUsers:objectViewer gs://$DOMAIN

./node_modules/.bin/ts-node -O '{"module":"commonjs"}' ./scripts/purge-cache.ts || echo "❌ Failed to purge Cloudflare cache"
