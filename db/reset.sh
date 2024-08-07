#!/usr/bin/env bash
# one script to orchestrate db backup, teardown, cleanup, setup, and seeding

echo "reseting database ...";
./wipe.sh $1 && ./backup.sh $1 && ./setup.sh $1 && ./seed.sh $1 &&\
echo "database reset success!";
