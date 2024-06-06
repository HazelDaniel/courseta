#!/usr/bin/env bash
source ./.environment.zshrc
pg_dump -Utoughware -hlocalhost -dcourseta > "$(date +%y-%m_%d_%H_%M_%S)"-backup.sql
echo "backup created successfully!"
