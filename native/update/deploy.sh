#!/bin/sh
gsutil -m -h "Cache-Control:no-cache, max-age=0" cp -z js,css,html -r ./* gs://update.eqmac.app