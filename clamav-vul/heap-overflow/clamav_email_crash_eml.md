ASAN crash log
=============
```
➜  fuzzer git:(master) ✗ ./clamav_fuzzer clamav-heap-overflow.eml 
=================================================================
==2950==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000007ed9 at pc 0x000000466783 bp 0x7fffe72fcd20 sp 0x7fffe72fcd10
READ of size 1 at 0x602000007ed9 thread T0
    #0 0x466782 in messageFindArgument /home/varsleak/github/clamav-devel/libclamav/message.c:685
    #1 0x4668ff in messageGetFilename /home/varsleak/github/clamav-devel/libclamav/message.c:717
    #2 0x46967a in messageExport /home/varsleak/github/clamav-devel/libclamav/message.c:1304
    #3 0x46a1fa in messageToFileblob /home/varsleak/github/clamav-devel/libclamav/message.c:1477
    #4 0x463fd1 in do_multipart /home/varsleak/github/clamav-devel/libclamav/mbox.c:4090
    #5 0x45b9a1 in parseEmailBody /home/varsleak/github/clamav-devel/libclamav/mbox.c:1815
    #6 0x4578e9 in cli_parse_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:555
    #7 0x4570c9 in cli_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:353
    #8 0x441a82 in cli_scanmail /home/varsleak/github/clamav-devel/libclamav/scanners.c:1792
    #9 0x44a47b in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2916
    #10 0x44d507 in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #11 0x44d65f in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #12 0x44ec3a in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #13 0x44ee0a in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #14 0x44d6e7 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #15 0x406799 in main /home/varsleak/github/clamav-devel/examples/ex1.c:88
    #16 0x7f80d4e7182f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #17 0x406438 in _start (/home/varsleak/github/clamav-devel/examples/fuzzer/clamav_fuzzer+0x406438)

0x602000007ed9 is located 0 bytes to the right of 9-byte region [0x602000007ed0,0x602000007ed9)
allocated by thread T0 here:
    #0 0x7f80d6aad30f in strdup (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x6230f)
    #1 0x7a6300 in cli_strdup /home/varsleak/github/clamav-devel/libclamav/others_common.c:276
    #2 0x46dc72 in rfc2231 /home/varsleak/github/clamav-devel/libclamav/message.c:2354
    #3 0x46578d in messageAddArgument /home/varsleak/github/clamav-devel/libclamav/message.c:435
    #4 0x45f764 in parseMimeHeader /home/varsleak/github/clamav-devel/libclamav/mbox.c:2927
    #5 0x459767 in parseEmailHeader /home/varsleak/github/clamav-devel/libclamav/mbox.c:1089
    #6 0x45b7d2 in parseEmailBody /home/varsleak/github/clamav-devel/libclamav/mbox.c:1774
    #7 0x4578e9 in cli_parse_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:555
    #8 0x4570c9 in cli_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:353
    #9 0x441a82 in cli_scanmail /home/varsleak/github/clamav-devel/libclamav/scanners.c:1792
    #10 0x44a47b in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2916
    #11 0x44d507 in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #12 0x44d65f in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #13 0x44ec3a in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #14 0x44ee0a in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #15 0x44d6e7 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #16 0x406799 in main /home/varsleak/github/clamav-devel/examples/ex1.c:88
    #17 0x7f80d4e7182f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

SUMMARY: AddressSanitizer: heap-buffer-overflow /home/varsleak/github/clamav-devel/libclamav/message.c:685 messageFindArgument
Shadow bytes around the buggy address:
  0x0c047fff8f80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8f90: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8fa0: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8fb0: fa fa 00 00 fa fa 00 00 fa fa 00 00 fa fa 00 00
  0x0c047fff8fc0: fa fa 00 00 fa fa 00 00 fa fa 00 00 fa fa 00 00
=>0x0c047fff8fd0: fa fa 00 00 fa fa 00 00 fa fa 00[01]fa fa 00 00
  0x0c047fff8fe0: fa fa 00 03 fa fa 04 fa fa fa fd fa fa fa 00 06
  0x0c047fff8ff0: fa fa fd fa fa fa fd fd fa fa 00 fa fa fa fd fa
  0x0c047fff9000: fa fa fd fa fa fa fd fd fa fa fd fd fa fa fd fa
  0x0c047fff9010: fa fa fd fa fa fa fd fa fa fa fd fa fa fa fd fa
  0x0c047fff9020: fa fa fd fa fa fa fd fa fa fa fd fa fa fa fd fd
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
==2950==ABORTING
```
