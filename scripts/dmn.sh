#!/bin/bash
# strict mode http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

function commit_npmignore () {
  if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != '' ]]; then
    git add .npmignore && \
    git commit --no-verify -m'Chore update npmignore'
  fi
}

dmn gen -f . && commit_npmignore

