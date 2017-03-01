ASAN crash log
==============
```
➜  fuzzer git:(master) ✗ ./clamav_fuzzer  clamav.crash.chm
LibClamAV Warning: cli_load: unknown extension - skipping /home/varsleak/.local/share/clamav
=================================================================
==31938==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x631000024800 at pc 0x7f7d8080d904 bp 0x7ffed7e460f0 sp 0x7ffed7e45898
WRITE of size 2003 at 0x631000024800 thread T0
    #0 0x7f7d8080d903 in __asan_memcpy (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x8c903)
    #1 0x7f7d800404df in mspack_fmap_copy /home/varsleak/github/clamav-devel/libclamav/libmspack.c:272
    #2 0x7f7d80368a74 in lzxd_decompress mspack/lzxd.c:777
    #3 0x7f7d80352d35 in chmd_extract mspack/chmd.c:1002
    #4 0x7f7d800419c4 in cli_scanmschm /home/varsleak/github/clamav-devel/libclamav/libmspack.c:486
    #5 0x7f7d7ffaa5d8 in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2936
    #6 0x7f7d7ffad3be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #7 0x7f7d7ffad516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #8 0x7f7d7ffaeb5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #9 0x7f7d7ffaed2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #10 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #11 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #12 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #13 0x7f7d7f87782f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #14 0x403148 in _start (/home/varsleak/.local/bin/clamscan+0x403148)

0x631000024800 is located 0 bytes to the right of 65536-byte region [0x631000014800,0x631000024800)
allocated by thread T0 here:
    #0 0x7f7d80819602 in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x98602)
    #1 0x7f7d80040497 in mspack_fmap_alloc /home/varsleak/github/clamav-devel/libclamav/libmspack.c:262
    #2 0x7f7d8035f6b0 in lzxd_init mspack/lzxd.c:312
    #3 0x7f7d803544f1 in chmd_init_decomp mspack/chmd.c:1158
    #4 0x7f7d80352af7 in chmd_extract mspack/chmd.c:990
    #5 0x7f7d800419c4 in cli_scanmschm /home/varsleak/github/clamav-devel/libclamav/libmspack.c:486
    #6 0x7f7d7ffaa5d8 in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:2936
    #7 0x7f7d7ffad3be in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230
    #8 0x7f7d7ffad516 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239
    #9 0x7f7d7ffaeb5c in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #10 0x7f7d7ffaed2c in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589
    #11 0x411d36 in scanfile /home/varsleak/github/clamav-devel/clamscan/manager.c:392
    #12 0x416f60 in scanmanager /home/varsleak/github/clamav-devel/clamscan/manager.c:1203
    #13 0x40f6e4 in main /home/varsleak/github/clamav-devel/clamscan/clamscan.c:161
    #14 0x7f7d7f87782f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)

SUMMARY: AddressSanitizer: heap-buffer-overflow ??:0 __asan_memcpy
Shadow bytes around the buggy address:
  0x0c627fffc8b0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c627fffc8c0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c627fffc8d0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c627fffc8e0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0c627fffc8f0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0c627fffc900:[fa]fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c627fffc910: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c627fffc920: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c627fffc930: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c627fffc940: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c627fffc950: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
==31938==ABORTING
```
