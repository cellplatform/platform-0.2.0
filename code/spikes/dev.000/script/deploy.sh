#!/usr/bin/env

yarn audit 
yarn version --patch --no-git-tag-version
yarn prepare
ts-node-esm -T ./script/deploy.mts
