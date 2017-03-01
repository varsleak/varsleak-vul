ASAN crash log
=============
```
➜  fuzzer git:(master) ✗ ./clamav_fuzzer clamav_email_crash.eml
LibClamAV Warning: cli_load: unknown extension - skipping /home/varsleak/.local/share/clamav
=================================================================
==15772==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000006419 at pc 0x7f51beaac3f1 bp 0x7ffebc58ab60 sp 0x7ffebc58ab50
READ of size 1 at 0x602000006419 thread T0
    #0 0x7f51beaac3f0 in messageFindArgument /home/varsleak/github/clamav-devel/libclamav/message.c:685
    #1 0x7f51beaac56f in messageGetFilename /home/varsleak/github/clamav-devel/libclamav/message.c:717
    #2 0x7f51beaaf3a3 in messageExport /home/varsleak/github/clamav-devel/libclamav/message.c:1304
    #3 0x7f51beaaff8c in messageToFileblob /home/varsleak/github/clamav-devel/libclamav/message.c:1477
    #4 0x7f51beaa9b67 in do_multipart /home/varsleak/github/clamav-devel/libclamav/mbox.c:4090
    #5 0x7f51beaa126c in parseEmailBody /home/varsleak/github/clamav-devel/libclamav/mbox.c:1815
    #6 0x7f51bea9cf95 in cli_parse_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:555
    #7 0x7f51bea9c72d in cli_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:353
    #8 0x7f51bea83689 in cli_scanmail /home/varsleak/github/clamav-devel/libclamav/scanners.c:1792
    #9 0x7f51bea8c2ab in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2916
    #10 0x7f51bea8f3be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #11 0x7f51bea8f516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #12 0x7f51bea90b5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #13 0x7f51bea90d2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #14 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #15 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #16 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #17 0x7f51be35982f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #18 0x403148 in _start (/home/varsleak/.local/bin/clamscan+0x403148)

0x602000006419 is located 0 bytes to the right of 9-byte region [0x602000006410,0x602000006419)
allocated by thread T0 here:
    #0 0x7f51bf2c530f in strdup (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x6230f)
    #1 0x7f51bee680c6 in cli_strdup /home/varsleak/github/clamav-devel/libclamav/others_common.c:276
    #2 0x7f51beab3ac1 in rfc2231 /home/varsleak/github/clamav-devel/libclamav/message.c:2354
    #3 0x7f51beaab397 in messageAddArgument /home/varsleak/github/clamav-devel/libclamav/message.c:435
    #4 0x7f51beaa5165 in parseMimeHeader /home/varsleak/github/clamav-devel/libclamav/mbox.c:2927
    #5 0x7f51bea9eeda in parseEmailHeader /home/varsleak/github/clamav-devel/libclamav/mbox.c:1089
    #6 0x7f51beaa107f in parseEmailBody /home/varsleak/github/clamav-devel/libclamav/mbox.c:1774
    #7 0x7f51bea9cf95 in cli_parse_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:555
    #8 0x7f51bea9c72d in cli_mbox /home/varsleak/github/clamav-devel/libclamav/mbox.c:353
    #9 0x7f51bea83689 in cli_scanmail /home/varsleak/github/clamav-devel/libclamav/scanners.c:1792
    #10 0x7f51bea8c2ab in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2916
    #11 0x7f51bea8f3be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #12 0x7f51bea8f516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #13 0x7f51bea90b5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #14 0x7f51bea90d2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #15 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #16 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #17 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #18 0x7f51be35982f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

SUMMARY: AddressSanitizer: heap-buffer-overflow /home/varsleak/github/clamav-devel/libclamav/message.c:685 messageFindArgument
Shadow bytes around the buggy address:
  0x0c047fff8c30: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8c40: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8c50: fa fa fa fa fa fa fa fa fa fa 00 00 fa fa 00 00
  0x0c047fff8c60: fa fa 00 00 fa fa 00 00 fa fa 00 00 fa fa 00 00
  0x0c047fff8c70: fa fa 00 00 fa fa 00 00 fa fa 00 00 fa fa 00 00
=>0x0c047fff8c80: fa fa 00[01]fa fa 00 00 fa fa 00 03 fa fa 04 fa
  0x0c047fff8c90: fa fa fd fa fa fa 00 06 fa fa fd fa fa fa fd fd
  0x0c047fff8ca0: fa fa 00 fa fa fa fd fa fa fa fd fa fa fa fd fd
  0x0c047fff8cb0: fa fa fd fd fa fa fd fa fa fa fd fa fa fa fd fa
  0x0c047fff8cc0: fa fa fd fa fa fa fd fa fa fa fd fa fa fa fd fa
  0x0c047fff8cd0: fa fa fd fa fa fa fd fd fa fa fd fa fa fa fd fa
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
==15772==ABORTING

```
