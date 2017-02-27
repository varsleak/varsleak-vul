#!/bin/bash

gcc -fsanitize=address -ggdb -Wall ex1.c -o clamav_fuzzer -I ../libclamav ../libclamav/.libs/libclamav.a -lpthread -lm -ldl -lm -lpthread -lcrypto -lssl -lz -lxml2 -lpcre -lbz2 -lltdl
