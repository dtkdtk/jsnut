#!/usr/bin/env bash

rm -rf "test/sorting_includes/sorted"
mkdir "test/sorting_includes/sorted"
cp "./test/sorting_includes/unsorted_includes_minimal.cc" "./test/sorting_includes/sorted/sorted_includes_minimal.cc"
cp "./test/sorting_includes/unsorted_includes_normal.cc" "./test/sorting_includes/sorted/sorted_includes_normal.cc"
cp "./test/sorting_includes/unsorted_includes_warning.cc" "./test/sorting_includes/sorted/sorted_includes_warning.cc"
npm run-script -- jsnut sort_includes "./test/sorting_includes/sorted"
./pause.bash