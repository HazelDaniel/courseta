#!/usr/bin/env bash
#
source ../db/.environment.zshrc &&\
source ./.console.zshrc &&\
npm run dev -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"
