#!/usr/bin/env bash

WEBKIT_VERSION=0.7.2
PWD=`pwd`
NW_GYP=$PWD/node_modules/.bin/nw-gyp

echo "Patch node-expat..."
cd app/node_modules/node-xmpp/node_modules/node-expat
$NW_GYP configure --target=$WEBKIT_VERSION
$NW_GYP build

echo "Finished"