#!/usr/bin/env bash
# backing up db to stored csv/sql files
source ./.environment.zshrc
pg_dump -Utoughware -hlocalhost -dcourseta > ./backup/schema/"$(date +%y-%m_%d_%H_%M_%S)"-backup.sql

echo "creating backup for all tables...";
for i in `cat ./backup/dependency.txt`; do
	echo "backing up: $i..."
	if [[ ! -d "./backup/tables/$i"  ]]; then
		mkdir ./backup/tables/"$i"
	fi
	psql -Utoughware -p5432 -hlocalhost -d courseta -c "\COPY $i TO backup/tables/$i/$i-$(date +%N).csv DELIMITER ',' HEADER CSV";
done

echo "backup created successfully!"
