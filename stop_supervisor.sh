#!/bin/bash

printf "READY\n";

sleep 90;

while read line; do
  echo "Processing Event: $line" >&2;
  kill -3 $(cat "/tmp/supervisord.pid")
done < /dev/stdin
