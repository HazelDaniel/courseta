#!/usr/bin/env bash
# populating the db with the stored csv/sql files
source ./.environment.zshrc
echo "populating schema..."
pg_dump -Utoughware -hlocalhost -dcourseta -f "$(find ./backup/schema -type f | sort -n | tail -n 1)" &&\
echo "done" &&\


echo "seeding database ..."
for i in `cat ./backup/dependency.txt`; do
	# echo $i
	if [[ ! -d "./backup/tables/$i"  ]]; then
		mkdir ./backup/tables/"$i"
	fi
	dest=$(find "./backup/tables/$i" -type f | sort -n | tail -n 1)
	psql -Utoughware -p5432 -hlocalhost -d courseta -c "\COPY $i FROM $dest DELIMITER ',' HEADER CSV";
done

echo "database seeded successfully!"
