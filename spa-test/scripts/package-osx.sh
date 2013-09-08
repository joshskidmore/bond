#!/usr/bin/env bash

echo "Removing old Bond.app..."
rm -rf Bond.app

echo "Creating nw zip bundle..."
zip -r ../app.nw *

echo "Creating temp directory..."
mkdir Bond.app

echo "Copying app binaries..."
rsync -ravP ../node-webkit-v0.7.2-osx-ia32/node-webkit.app/ ./Bond.app/
rsync -ravP scripts/packaging-osx/ ./Bond.app/

echo "Moving app.nw..."
mv ../app.nw ./Bond.app/Contents/Resources/

echo "Finished - the app is ./Bond.app"