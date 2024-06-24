#!/usr/bin/env bash
# one script to orchestrate db backup, teardown, cleanup, setup, and seeding

echo "reseting database ...";
./backup.sh && ./setup.sh && ./seed.sh &&\
echo "database reset success!";
