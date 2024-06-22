#!/usr/bin/env bash

source ../db/.environment.zshrc
source ./.console.zshrc
cd ../db && ./setup.sh &&\
	psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO admins (admin_id, email, password) VALUES ('$CST_SUPERUSER_ID' , '$CST_SUPERUSER_EMAIL', '$CST_SUPERUSER_PASSWORD');" &&\
	psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO creators (creator_id ,email, first_name, last_name, password)\
	VALUES ('$CST_SUPERUSER_ID','$CST_SUPERUSER_EMAIL' , '$CST_SUPERUSER_FIRSTNAME', '$CST_SUPERUSER_LASTNAME', '$CST_SUPERUSER_PASSWORD');" &&\
cd - &&\
npm run dev -- "-e${CST_SUPERUSER_EMAIL}" "-p${CST_SUPERUSER_PASSWORD}" "-i${CST_SUPERUSER_ID}"
