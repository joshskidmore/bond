#!/usr/bin/env bash

WEBKIT_VERSION=0.7.2

echo "Install nw-gyp (globally)..."
sudo npm install nw-gyp -g

echo "Install modules..."
npm install

echo "Patch node-expat..."
cd node_modules/node-xmpp/node_modules/node-expat
nw-gyp configure --target=$WEBKIT_VERSION
nw-gyp build

echo "Finished"