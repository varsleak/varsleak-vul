ASAN crash log
==============
```
➜  fuzzer git:(master) ✗ ./clamav_fuzzer [clamav-use-after-free.exe](https://github.com/varsleak/varsleak-vul/blob/master/clamav-vul/use-after-free/clamav-use-after-free.exe)
=================================================================
==11882==ERROR: AddressSanitizer: heap-use-after-free on address 0x611000007e95 at pc 0x0000004cd9cc bp 0x7ffc5d8f5fc0 sp 0x7ffc5d8f5fb0
READ of size 4 at 0x611000007e95 thread T0
    #0 0x4cd9cb in wwunpack /home/varsleak/github/clamav-devel/libclamav/wwunpack.c:229
    #1 0x4a6f1b in cli_scanpe /home/varsleak/github/clamav-devel/libclamav/pe.c:4756
    #2 0x44cbbb in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3159
    #3 0x44d507 in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #4 0x44d65f in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #5 0x44ec3a in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #6 0x44ee0a in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #7 0x44d6e7 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #8 0x406799 in main /home/varsleak/github/clamav-devel/examples/ex1.c:88
    #9 0x7f24773d882f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #10 0x406438 in _start (/home/varsleak/github/clamav-devel/examples/fuzzer/clamav_fuzzer+0x406438)

0x611000007e95 is located 21 bytes inside of 200-byte region [0x611000007e80,0x611000007f48)
freed by thread T0 here:
    #0 0x7f247904a2ca in __interceptor_free (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x982ca)
    #1 0x4ad7b0 in cli_peheader /home/varsleak/github/clamav-devel/libclamav/pe.c:5287
    #2 0x7e8e4e in cli_targetinfo /home/varsleak/github/clamav-devel/libclamav/matcher.c:496
    #3 0x7ed52b in cli_fmap_scandesc /home/varsleak/github/clamav-devel/libclamav/matcher.c:914
    #4 0x443c31 in cli_scanraw /home/varsleak/github/clamav-devel/libclamav/scanners.c:2148
    #5 0x44c2b8 in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3091
    #6 0x44d507 in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #7 0x44d65f in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #8 0x44ec3a in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #9 0x44ee0a in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #10 0x44d6e7 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #11 0x406799 in main /home/varsleak/github/clamav-devel/examples/ex1.c:88
    #12 0x7f24773d882f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

previously allocated by thread T0 here:
    #0 0x7f247904a79a in __interceptor_calloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x9879a)
    #1 0x7a6157 in cli_calloc /home/varsleak/github/clamav-devel/libclamav/others_common.c:217
    #2 0x4aabdc in cli_peheader /home/varsleak/github/clamav-devel/libclamav/pe.c:5042
    #3 0x7e8e4e in cli_targetinfo /home/varsleak/github/clamav-devel/libclamav/matcher.c:496
    #4 0x7ed52b in cli_fmap_scandesc /home/varsleak/github/clamav-devel/libclamav/matcher.c:914
    #5 0x443c31 in cli_scanraw /home/varsleak/github/clamav-devel/libclamav/scanners.c:2148
    #6 0x44c2b8 in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3091
    #7 0x44d507 in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #8 0x44d65f in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #9 0x44ec3a in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #10 0x44ee0a in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #11 0x44d6e7 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #12 0x406799 in main /home/varsleak/github/clamav-devel/examples/ex1.c:88
    #13 0x7f24773d882f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

SUMMARY: AddressSanitizer: heap-use-after-free /home/varsleak/github/clamav-devel/libclamav/wwunpack.c:229 wwunpack
Shadow bytes around the buggy address:
  0x0c227fff8f80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c227fff8f90: 00 00 00 00 00 00 00 00 00 00 00 00 00 04 fa fa
  0x0c227fff8fa0: fa fa fa fa fa fa fa fa fd fd fd fd fd fd fd fd
  0x0c227fff8fb0: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff8fc0: fd fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
=>0x0c227fff8fd0: fd fd[fd]fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff8fe0: fd fd fd fd fd fd fd fd fd fa fa fa fa fa fa fa
  0x0c227fff8ff0: fa fa fa fa fa fa fa fa fd fd fd fd fd fd fd fd
  0x0c227fff9000: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff9010: fd fd fd fd fd fd fd fd fa fa fa fa fa fa fa fa
  0x0c227fff9020: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Heap right redzone:      fb
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack partial redzone:   f4
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
==11882==ABORTING

```
