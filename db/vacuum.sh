#!/usr/bin/env bash
# cleaning up old backup files
echo "removing old schema backup...";

if [[ $1 == 'test' ]]; then
	VACUUM_DIR_PATH='./backup_test';
else
	VACUUM_DIR_PATH='./backup';
fi

for i in $(find $VACUUM_DIR_PATH/schema -type f | sort -n | head -n -1); do
	echo "removing $i..."
	rm -rf "$i"
done &&\
echo "done!" &&\

echo "removing old tables backup...";
for i in $(cat $VACUUM_DIR_PATH/dependency.txt); do
	for j in $(find "$VACUUM_DIR_PATH/tables/$i" -type f | sort -n | head -n -1); do
		echo "removing $j..."
		rm -rf "$j"
	done
done &&\
echo "done!" &&\
echo "backup vacuumed successfully!";

