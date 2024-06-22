#!/usr/bin/env bash
# this is the startup script for the console application

source ../db/.environment.zshrc
source ./.console.zshrc
cd ../db && ./setup.sh &&\
	psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO admins (admin_id, email, password) VALUES ('$CST_SUPERUSER_ID' , '$CST_SUPERUSER_EMAIL', '$CST_SUPERUSER_PASSWORD') ON CONFLICT DO NOTHING;" &&\
	psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO creators (creator_id ,email, first_name, last_name, password)\
	VALUES ('$CST_SUPERUSER_ID','$CST_SUPERUSER_EMAIL' , '$CST_SUPERUSER_FIRSTNAME', '$CST_SUPERUSER_LASTNAME', '$CST_SUPERUSER_PASSWORD') ON CONFLICT DO NOTHING;" &&\
cd - &&\
npm run dev -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"
