#!/usr/bin/env bash

echo "Removing old Bond.app..."
rm -rf Bond.app

echo "Creating temp directory..."
mkdir Bond.app

echo "Copying app binaries..."
rsync -ravP ../node-webkit-v0.7.2-osx-ia32/node-webkit.app/ ./Bond.app/
rsync -ravP scripts/packaging-osx/ ./Bond.app/

echo "Copying app.nw..."
rsync -ravP ./ ./Bond.app/Contents/Resources/app.nw

echo "Finished - the app is ./Bond.app"