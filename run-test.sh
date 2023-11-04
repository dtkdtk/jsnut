#!/usr/bin/env bash

npm run-script jsnut -- build               \
    -f "./test/hello_world/some_code.cc"    \
    -f "./test/hello_world/otherfile.cc"    \
    -f "./test/hello_world/otherfile.hh"    \
    -o "./test/hello_world/compiled"        \
    --clean
bash ./pause.sh