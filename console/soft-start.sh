#!/usr/bin/env bash
# this is the startup script for the console application in dev mode without db teardown and setup

source ./.console.zshrc &&\
npm run dev -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"
