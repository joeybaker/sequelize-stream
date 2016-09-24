#!/bin/bash
# strict mode http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

npm run -s doctoc
NODE_ENV=production babel src --out-dir dist --ignore '**/*.test.js'
