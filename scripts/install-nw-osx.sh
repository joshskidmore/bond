#!/usr/bin/env bash

echo "Downloading + Installing node-webkit for OS X..."
curl -O https://s3.amazonaws.com/node-webkit/v0.7.2/node-webkit-v0.7.2-osx-ia32.zip
unzip node-webkit-v0.7.2-osx-ia32.zip -d node-webkit-v0.7.2-osx-ia32
mv node-webkit-v0.7.2-osx-ia32/node-webkit.app /Applications
rm node-webkit-v0.7.2-osx-ia32.zip
rm -rf node-webkit-v0.7.2-osx-ia32