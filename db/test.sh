#!/usr/bin/env bash
# this runs the test suite for the DB
source ./.environment.zshrc
for i in $(find ./tests -type f | sort -n); do
	./setup.sh && psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i";
done
