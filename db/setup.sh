#!/usr/bin/env bash
source ./.environment.zshrc

for i in $(ls ./setup); do
	psql -Utoughware -p5432 -hlocalhost -d postgres -f "./setup/$i";
done

for i in $(ls ./tables); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "./tables/$i";
done

for i in $(ls ./functions); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "./functions/$i";
done

for i in $(ls ./triggers); do
	psql -Utoughware -p5432 -hlocalhost -d courseta -f "./triggers/$i";
done
