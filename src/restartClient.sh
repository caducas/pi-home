#!/bin/bash
PID=$(ps ax | grep "src/Client.js" | awk '{print $1}')

sudo kill -KILL $PID
