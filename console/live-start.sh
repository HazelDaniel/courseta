#!/usr/bin/env bash
# this is the startup script for the console application in live environment

source ../db/.environment.zshrc
source ./.console.zshrc
npm start -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"
