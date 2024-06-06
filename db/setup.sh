#!/usr/bin/env bash
source ./.environment.zshrc

for i in $(find ./setup -type f | sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d postgres -f "$i";
done

for i in $(find ./tables -type f | sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i";
done

for i in $(find ./functions -type f |  sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i";
done

for i in $(find ./triggers -type f |  sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i";
done
