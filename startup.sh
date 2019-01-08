#!/bin/bash
tsc
cp -R src/public dist
node dist/app
