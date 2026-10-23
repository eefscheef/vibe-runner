#!/usr/bin/env sh
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || { echo "Node.js is not installed: https://nodejs.org"; exit 1; }
[ -d node_modules ] || npm install || exit 1
npm start
