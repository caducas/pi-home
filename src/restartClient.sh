#!/bin/bash
PID=$(ps ax | grep "src/Client.js" | awk '{print $1}')

array=($PID)

sudo kill -KILL ${array[1]}
