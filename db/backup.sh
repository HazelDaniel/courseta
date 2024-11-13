#!/usr/bin/env bash
# backing up db to stored csv/sql files
#
source ./.environment.zshrc
if [[ $1 == 'test' ]]; then
	BACKUP_DIR_PATH='./backup_test';
	BACKUP_DB='courseta_test';
	BACKUP_HOST='localhost';
else
	BACKUP_DIR_PATH='./backup';
	BACKUP_DB='courseta';
	if [[ $1 == 'prod' ]]; then
		BACKUP_HOST=$PROD_DB_HOST;
	else
		BACKUP_HOST='localhost';
	fi;
fi


pg_dump -v -Utoughware -h$BACKUP_HOST -d$BACKUP_DB --schema=courseta --schema-only > $BACKUP_DIR_PATH/schema/"$(date +%y-%m_%d_%H_%M_%S)"-backup.sql

echo "creating backup for all tables...";
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	echo "backing up: $i..."
	if [[ ! -d "$BACKUP_DIR_PATH/tables/$i"  ]]; then
		mkdir $BACKUP_DIR_PATH/tables/"$i"
	fi
	psql -Utoughware -p5432 -h$BACKUP_HOST -d$BACKUP_DB -c "\COPY $i TO $BACKUP_DIR_PATH/tables/$i/$i-$(date +%y-%m_%d_%H_%M_%S_%N).csv DELIMITER ',' HEADER CSV";
done

echo "backup created successfully!"
