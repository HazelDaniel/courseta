#!/usr/bin/env bash
# the setup script to change the default database setup for the session store

DIR_PATH=`dirname $0`
source "$DIR_PATH/".setup.zshrc

if [[ $1 == "test" ]]; then
	psql -U$CST_DB_USER -h$CST_DB_HOST -d$CST_TEST_SESSION -f $DIR_PATH/setup-sessions.sql -w
else
	psql -U$CST_DB_USER -h$CST_DB_HOST -d$CST_SESSION -f $DIR_PATH/setup-sessions.sql -w
fi;
