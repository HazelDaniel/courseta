#!/usr/bin/env bash
# cleaning up all backup files
echo "removing all schema backup...";
for i in $(find ./backup/schema -type f); do
	echo "removing $i..."
	rm -rf "$i"
done &&\
echo "done!" &&\

echo "removing all tables backup...";
for i in $(cat ./backup/dependency.txt); do
	for j in $(find "./backup/tables/$i" -type f); do
		echo "removing $j..."
		rm -rf "$j"
	done
done &&\
echo "done!" &&\
echo "backup wiped successfully!";

