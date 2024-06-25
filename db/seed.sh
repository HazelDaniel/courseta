#!/usr/bin/env bash
# populating the db with the stored csv/sql files
source ./.environment.zshrc
echo "populating schema..."
psql -Utoughware -hlocalhost -dcourseta -f "$(find ./backup/schema -type f | sort -n | tail -n 1)" &&\
echo "done" &&\

echo "disabling triggers...";
for i in `cat ./backup/dependency.txt`; do
	echo "disabling trigggers before copying: $i..."
	psql -Utoughware -p5432 -hlocalhost -d courseta -c "ALTER TABLE $i DISABLE TRIGGER ALL" ;
done &&\

echo "seeding database ..."
for i in `cat ./backup/dependency.txt`; do
	if [[ ! -d "./backup/tables/$i"  ]]; then
		mkdir ./backup/tables/"$i"
	fi
	dest=$(find "./backup/tables/$i" -type f | sort -n | tail -n 1)
	echo "using: $dest as destination";
	psql -Utoughware -p5432 -hlocalhost -d courseta -c "\COPY $i FROM $dest DELIMITER ',' HEADER CSV";
done &&\

echo "enabling triggers...";
for i in `cat ./backup/dependency.txt`; do
	echo "enabling trigggers after copying: $i..."
	psql -Utoughware -p5432 -hlocalhost -d courseta -c "ALTER TABLE $i ENABLE TRIGGER ALL" ;
done &&\
echo "updating sequences..." &&\
psql -Utoughware -p5432 -hlocalhost -d courseta -f ./backup/fix-sequence.sql &&\
echo "sequence updated!";
echo "database seeded successfully!";
