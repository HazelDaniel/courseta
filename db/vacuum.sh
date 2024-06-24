#!/usr/bin/env bash
# cleaning up old backup files
echo "removing old schema backup...";
for i in $(find ./backup/schema -type f | sort -n | head -n -1); do
	echo "removing $i..."
	rm -rf "$i"
done &&\
echo "done!" &&\

echo "removing old tables backup...";
for i in $(cat ./backup/dependency.txt); do
	for j in $(find "./backup/tables/$i" -type f | sort -n | head -n -1); do
		echo "removing $j..."
		rm -rf "$j"
	done
done &&\
echo "done!" &&\
echo "backup vacuumed successfully!";

