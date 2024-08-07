#!/usr/bin/env bash
# cleaning up all backup files
echo "removing all schema backup...";

if [[ $1 == 'test' ]]; then
	BACKUP_DIR_PATH='./backup_test';
	source ./.environment.zshrc
else
	BACKUP_DIR_PATH='./backup';
	source ./.environment.zshrc
fi

for i in $(find $BACKUP_DIR_PATH/schema -type f); do
	echo "removing $i..."
	rm -rf "$i"
done &&\
echo "done!" &&\

echo "removing all tables backup...";
for i in $(cat $BACKUP_DIR_PATH/dependency.txt); do
	for j in $(find "$BACKUP_DIR_PATH/tables/$i" -type f); do
		echo "removing $j..."
		rm -rf "$j"
	done
done &&\
echo "done!" &&\
echo "backup wiped successfully!";

