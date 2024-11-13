#!/usr/bin/env bash
# populating the db with the stored csv/sql files
source ./.environment.zshrc

if [[ $1 == 'test' ]]; then
	BACKUP_DIR_PATH='./backup_test';
	SEED_DB='courseta_test';
	SEED_HOST='localhost';
else
	BACKUP_DIR_PATH='./backup';
	SEED_DB='courseta';
	if [[ $1 == 'prod' ]] then
		SEED_HOST=$PROD_DB_HOST;
	else
		SEED_HOST='localhost';
	fi;
fi

source ./.environment.zshrc
echo "populating schema..."

if [[ $1 != 'test' ]]; then
	psql -Utoughware -h$SEED_HOST -d$SEED_DB -f "$(find $BACKUP_DIR_PATH/schema -type f | sort -n | tail -n 1)"
fi &&\
echo "done" &&\

echo "disabling triggers...";
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	echo "disabling trigggers before copying: $i..."
	psql -Utoughware -p5432 -h$SEED_HOST -d $SEED_DB -c "ALTER TABLE $i DISABLE TRIGGER ALL" ;
done &&\

echo "seeding database ..."
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	if [[ ! -d "$BACKUP_DIR_PATH/tables/$i"  ]]; then
		mkdir -p $BACKUP_DIR_PATH/tables/"$i"
	fi
	dest=$(find "$BACKUP_DIR_PATH/tables/$i" -type f | sort -n | tail -n 1)
	echo "using: $dest as destination";
	psql -Utoughware -p5432 -h$SEED_HOST -d $SEED_DB -c "\COPY $i FROM $dest DELIMITER ',' HEADER CSV";
done &&\

echo "enabling triggers...";
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	echo "enabling trigggers after copying: $i..."
	psql -Utoughware -p5432 -h$SEED_HOST -d $SEED_DB -c "ALTER TABLE $i ENABLE TRIGGER ALL" ;
done &&\
echo "updating sequences..." &&\
psql -Utoughware -p5432 -h$SEED_HOST -d $SEED_DB -f $BACKUP_DIR_PATH/fix-sequence.sql &&\
echo "sequence updated!";
echo "database seeded successfully!";
