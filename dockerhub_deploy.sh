#! /bin/bash
docker login -u $DOCKER_USER -p $DOCKER_PASS
export REPO=qcifengineering/redbox-portal:sails-hook-redbox-pdfgen
yarn install;
docker build -f Dockerfile -t $REPO .
docker push $REPO
