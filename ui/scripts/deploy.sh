#!/bin/sh
set -e

UI_VERSION=$(node -e "console.log(require('./package.json').version)")
SUBDOMAIN_VERSION=$(node -e "const [ major, minor ] = require('./package.json').version.split('.');console.log([major, minor, 0].join(''))")
DOMAIN=ui-v$SUBDOMAIN_VERSION.eqmac.app

echo $UI_VERSION
echo $SUBDOMAIN_VERSION

npm run build

gcloud config set account $GCLOUD_ACCOUNT
gcloud config set project $GCLOUD_PROJECT_ID

gsutil -m cp -z js,css,html -r dist/* gs://$DOMAIN
gsutil -m setmeta -h "Content-Type:text/html;charset=utf-8" gs://$DOMAIN/**/*.html

gsutil iam ch allUsers:objectViewer gs://$DOMAIN

./node_modules/.bin/ts-node -O '{"module":"commonjs"}' ./scripts/purge-cache.ts || echo "❌ Failed to purge Cloudflare cache"
