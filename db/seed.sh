#!/usr/bin/env bash
# populating the db with the stored csv/sql files

if [[ $1 == 'test' ]]; then
	BACKUP_DIR_PATH='./backup_test';
	SEED_DB='courseta_test';
	source ./.environment.zshrc
else
	BACKUP_DIR_PATH='./backup';
	SEED_DB='courseta';
	source ./.environment.zshrc
fi

source ./.environment.zshrc
echo "populating schema..."
psql -Utoughware -hlocalhost -d$SEED_DB -f "$(find $BACKUP_DIR_PATH/schema -type f | sort -n | tail -n 1)" &&\
echo "done" &&\

echo "disabling triggers...";
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	echo "disabling trigggers before copying: $i..."
	psql -Utoughware -p5432 -hlocalhost -d $SEED_DB -c "ALTER TABLE $i DISABLE TRIGGER ALL" ;
done &&\

echo "seeding database ..."
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	if [[ ! -d "$BACKUP_DIR_PATH/tables/$i"  ]]; then
		mkdir -p $BACKUP_DIR_PATH/tables/"$i"
	fi
	dest=$(find "$BACKUP_DIR_PATH/tables/$i" -type f | sort -n | tail -n 1)
	echo "using: $dest as destination";
	psql -Utoughware -p5432 -hlocalhost -d $SEED_DB -c "\COPY $i FROM $dest DELIMITER ',' HEADER CSV";
done &&\

echo "enabling triggers...";
for i in `cat $BACKUP_DIR_PATH/dependency.txt`; do
	echo "enabling trigggers after copying: $i..."
	psql -Utoughware -p5432 -hlocalhost -d $SEED_DB -c "ALTER TABLE $i ENABLE TRIGGER ALL" ;
done &&\
echo "updating sequences..." &&\
psql -Utoughware -p5432 -hlocalhost -d $SEED_DB -f $BACKUP_DIR_PATH/fix-sequence.sql &&\
echo "sequence updated!";
echo "database seeded successfully!";
