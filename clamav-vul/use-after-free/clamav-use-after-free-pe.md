ASAN crash log
==============
```
➜  fuzzer git:(master) ✗ ./clamav_fuzzer clamav-use-after-free.exe
LibClamAV Warning: cli_load: unknown extension - skipping /home/varsleak/.local/share/clamav
=================================================================
==7813==ERROR: AddressSanitizer: heap-use-after-free on address 0x611000007c15 at pc 0x7fa99e035689 bp 0x7ffe98962520 sp 0x7ffe98962510
READ of size 4 at 0x611000007c15 thread T0
    #0 0x7fa99e035688 in wwunpack /home/varsleak/github/clamav-devel/libclamav/wwunpack.c:229
    #1 0x7fa99dff5fc8 in cli_scanpe /home/varsleak/github/clamav-devel/libclamav/pe.c:4756
    #2 0x7fa99df96a1e in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3159
    #3 0x7fa99df973be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #4 0x7fa99df97516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #5 0x7fa99df98b5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #6 0x7fa99df98d2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #7 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #8 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #9 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #10 0x7fa99d86182f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #11 0x403148 in _start (/home/varsleak/.local/bin/clamscan+0x403148)

0x611000007c15 is located 21 bytes inside of 200-byte region [0x611000007c00,0x611000007cc8)
freed by thread T0 here:
    #0 0x7fa99e8032ca in __interceptor_free (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x982ca)
    #1 0x7fa99dffc98d in cli_peheader /home/varsleak/github/clamav-devel/libclamav/pe.c:5287
    #2 0x7fa99df488fa in cli_targetinfo /home/varsleak/github/clamav-devel/libclamav/matcher.c:496
    #3 0x7fa99df4d093 in cli_fmap_scandesc /home/varsleak/github/clamav-devel/libclamav/matcher.c:914
    #4 0x7fa99df8d8d2 in cli_scanraw /home/varsleak/github/clamav-devel/libclamav/scanners.c:2148
    #5 0x7fa99df960ef in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3091
    #6 0x7fa99df973be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #7 0x7fa99df97516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #8 0x7fa99df98b5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #9 0x7fa99df98d2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #10 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #11 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #12 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #13 0x7fa99d86182f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

previously allocated by thread T0 here:
    #0 0x7fa99e80379a in __interceptor_calloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x9879a)
    #1 0x7fa99e36ff1d in cli_calloc /home/varsleak/github/clamav-devel/libclamav/others_common.c:217
    #2 0x7fa99dff9d7d in cli_peheader /home/varsleak/github/clamav-devel/libclamav/pe.c:5042
    #3 0x7fa99df488fa in cli_targetinfo /home/varsleak/github/clamav-devel/libclamav/matcher.c:496
    #4 0x7fa99df4d093 in cli_fmap_scandesc /home/varsleak/github/clamav-devel/libclamav/matcher.c:914
    #5 0x7fa99df8d8d2 in cli_scanraw /home/varsleak/github/clamav-devel/libclamav/scanners.c:2148
    #6 0x7fa99df960ef in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3091
    #7 0x7fa99df973be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #8 0x7fa99df97516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #9 0x7fa99df98b5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #10 0x7fa99df98d2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #11 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #12 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #13 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #14 0x7fa99d86182f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

SUMMARY: AddressSanitizer: heap-use-after-free /home/varsleak/github/clamav-devel/libclamav/wwunpack.c:229 wwunpack
Shadow bytes around the buggy address:
  0x0c227fff8f30: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c227fff8f40: 00 00 00 00 00 00 00 00 00 00 00 00 00 04 fa fa
  0x0c227fff8f50: fa fa fa fa fa fa fa fa fd fd fd fd fd fd fd fd
  0x0c227fff8f60: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff8f70: fd fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
=>0x0c227fff8f80: fd fd[fd]fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff8f90: fd fd fd fd fd fd fd fd fd fa fa fa fa fa fa fa
  0x0c227fff8fa0: fa fa fa fa fa fa fa fa fd fd fd fd fd fd fd fd
  0x0c227fff8fb0: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x0c227fff8fc0: fd fd fd fd fd fd fd fd fa fa fa fa fa fa fa fa
  0x0c227fff8fd0: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
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
==7813==ABORTING

```
