#!/usr/bin/env bash
# db teardown, cleanup and setup
source ./.environment.zshrc

if [[ $1 == 'test' ]]; then
	SETUP_DB='courseta_test';
else
	SETUP_DB='courseta';
fi

for i in $(find ./setup -type f | sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d postgres -f "$i";
done


if [[ $? == 0 ]]; then
	for i in $(find ./tables -type f | sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d $SETUP_DB -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d $SETUP_DB -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./triggers -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d $SETUP_DB -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./GET-functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d $SETUP_DB -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./SET-functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d $SETUP_DB -f "$i";
		else
			break;
		fi
	done
fi
