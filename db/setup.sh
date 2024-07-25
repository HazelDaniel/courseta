#!/usr/bin/env bash
# db teardown, cleanup and setup
source ./.environment.zshrc


for i in $(find ./setup -type f | sort -n); do
	psql -Utoughware -p5432 -hlocalhost -d postgres -f "$i";
done


if [[ $? == 0 ]]; then
	for i in $(find ./tables -type f | sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i" &&\
			echo '---------------------------------------------------------------------------------------------------' &&\
			psql -Utoughware -p5432 -hlocalhost -d courseta_test -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i" &&\
			echo '---------------------------------------------------------------------------------------------------' &&\
			psql -Utoughware -p5432 -hlocalhost -d courseta_test -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./triggers -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i" &&\
			echo '---------------------------------------------------------------------------------------------------' &&\
			psql -Utoughware -p5432 -hlocalhost -d courseta_test -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./GET-functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i" &&\
			echo '---------------------------------------------------------------------------------------------------' &&\
			psql -Utoughware -p5432 -hlocalhost -d courseta_test -f "$i";
		else
			break;
		fi
	done
fi

if [[ $? == 0 ]]; then
	for i in $(find ./SET-functions -type f |  sort -n); do
		if [[ $? == 0 ]]; then
			psql -Utoughware -p5432 -hlocalhost -d courseta -f "$i" &&\
			echo '---------------------------------------------------------------------------------------------------' &&\
			psql -Utoughware -p5432 -hlocalhost -d courseta_test -f "$i";
		else
			break;
		fi
	done
fi
