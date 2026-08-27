#!/bin/bash
export PATH="/Users/webloo/.node-v22/node-v22.14.0-darwin-arm64/bin:$PATH"
cd "/Users/webloo/Desktop/batif dev/batif-app"
exec node "/Users/webloo/Desktop/batif dev/batif-app/node_modules/next/dist/bin/next" dev --port 3001 --hostname localhost
