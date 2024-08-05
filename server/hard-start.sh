#!/usr/bin/bash
source ../db/.environment.zshrc &&\
source ./.server.zshrc &&\
salt=klsfjskllfasfaskfsklafhsahfjlksfljalfldkh;
psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO admins (admin_id, email, password, is_superuser, salt) VALUES ('$CST_SUPERUSER_ID' , '$CST_SUPERUSER_EMAIL', '$CST_SUPERUSER_PASSWORD', 't', '$salt') ON CONFLICT DO NOTHING;" &&\
psql -Utoughware -hlocalhost -dcourseta -c "INSERT INTO creators (creator_id ,email, first_name, last_name, password, salt)\
VALUES ('$CST_SUPERUSER_ID','$CST_SUPERUSER_EMAIL' , '$CST_SUPERUSER_FIRSTNAME', '$CST_SUPERUSER_LASTNAME', '$CST_SUPERUSER_PASSWORD', '$salt') ON CONFLICT DO NOTHING;" &&\
psql -Utoughware -hlocalhost -dcourseta_test -c "INSERT INTO admins (admin_id, email, password, is_superuser, salt) VALUES ('$CST_SUPERUSER_ID' , '$CST_SUPERUSER_EMAIL', '$CST_SUPERUSER_PASSWORD', 't', '$salt') ON CONFLICT DO NOTHING;" &&\
psql -Utoughware -hlocalhost -dcourseta_test -c "INSERT INTO creators (creator_id ,email, first_name, last_name, password, salt)\
VALUES ('$CST_SUPERUSER_ID','$CST_SUPERUSER_EMAIL' , '$CST_SUPERUSER_FIRSTNAME', '$CST_SUPERUSER_LASTNAME', '$CST_SUPERUSER_PASSWORD', '$salt') ON CONFLICT DO NOTHING;"
