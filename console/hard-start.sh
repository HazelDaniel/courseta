#!/usr/bin/env bash
# this is the startup script for the console application in dev mode. it creates superusers before interacting with DB

source ../db/.environment.zshrc &&\
source ./.console.zshrc &&\
psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO admins (admin_id, email, password, is_superuser) VALUES ('$CST_SUPERUSER_ID' , '$CST_SUPERUSER_EMAIL', '$CST_SUPERUSER_PASSWORD', 't') ON CONFLICT DO NOTHING;" &&\
psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO creators (creator_id ,email, first_name, last_name, password)\
VALUES ('$CST_SUPERUSER_ID','$CST_SUPERUSER_EMAIL' , '$CST_SUPERUSER_FIRSTNAME', '$CST_SUPERUSER_LASTNAME', '$CST_SUPERUSER_PASSWORD') ON CONFLICT DO NOTHING;" &&\
npm run dev -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"

