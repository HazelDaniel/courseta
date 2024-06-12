#!/usr/bin/env bash
# this runs the test suite for the DB
source ./.environment.zshrc
x=1
for i in $(find ./tests -type f | sort -n); do
	if head -n 1 "$i" | grep -Piq "__test-ignore__" "$i";
	then
		((x += 1));
		continue;
	fi
	echo -e "[\e[32mUNIT\e[0m]: RUNNING TEST${x} <=> ${i}...";
	./setup.sh && psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i";
	echo -e "[\e[32mUNIT\e[0m]: DONE RUNNING TEST${x} <=> ${i}. (STATUS: " $?")";
	((x += 1));
	echo "";
	echo "";
done
