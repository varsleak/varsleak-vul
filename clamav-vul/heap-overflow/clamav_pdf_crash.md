
ASAN crash log
==============

```
➜  fuzzer git:(master) ✗ ./afl_clamav_fuzzer syncdir/fuzzer2/crashes.2017-03-13-10:18:32/id:000000,sig:06,src:002454,op:havoc,rep:32 
LibClamAV Warning: Cannot dlopen libclamunrar_iface: file not found - unrar support unavailable
=================================================================
==20240==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x7f9cfb52f000 at pc 0x0000006b9b2b bp 0x7ffdf5de1cf0 sp 0x7ffdf5de1ce8
READ of size 1 at 0x7f9cfb52f000 thread T0
    #0 0x6b9b2a in pdf_parse_string /home/varsleak/github/clamav-devel/libclamav/pdfng.c:554:46
    #1 0x6bd914 in pdf_parse_array /home/varsleak/github/clamav-devel/libclamav/pdfng.c:995:23
    #2 0x6bc086 in pdf_parse_dict /home/varsleak/github/clamav-devel/libclamav/pdfng.c:801:23
    #3 0x6a8281 in pdf_extract_obj /home/varsleak/github/clamav-devel/libclamav/pdf.c:955:35
    #4 0x6b6402 in cli_pdf /home/varsleak/github/clamav-devel/libclamav/pdf.c:2510:14
    #5 0x568411 in cli_scanpdf /home/varsleak/github/clamav-devel/libclamav/scanners.c:1710:11
    #6 0x552d6a in magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3014:9
    #7 0x54cc2c in cli_base_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3230:11
    #8 0x55c166 in cli_magic_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3239:12
    #9 0x55c166 in scan_common /home/varsleak/github/clamav-devel/libclamav/scanners.c:3471
    #10 0x55a2a0 in cl_scandesc_callback /home/varsleak/github/clamav-devel/libclamav/scanners.c:3589:12
    #11 0x55a2a0 in cl_scandesc /home/varsleak/github/clamav-devel/libclamav/scanners.c:3255
    #12 0x50815a in main /home/varsleak/github/clamav-devel/examples/clamav_fuzzer.c:80:15
    #13 0x7f9cf92f982f in __libc_start_main /build/glibc-t3gR2i/glibc-2.23/csu/../csu/libc-start.c:291
    #14 0x41cd58 in _start (/home/varsleak/github/clamav-devel/examples/fuzzer/afl_clamav_fuzzer+0x41cd58)

0x7f9cfb52f000 is located 6144 bytes to the left of 131080-byte region [0x7f9cfb530800,0x7f9cfb550808)
allocated by thread T0 here:
    #0 0x4d0058 in __interceptor_malloc /home/varsleak/github/llvm/llvm-3.9.1.src/build.ninja/../projects/compiler-rt/lib/asan/asan_malloc_linux.cc:64
    #1 0x98db49 in cli_malloc /home/varsleak/github/clamav-devel/libclamav/others_common.c:197:13

SUMMARY: AddressSanitizer: heap-buffer-overflow /home/varsleak/github/clamav-devel/libclamav/pdfng.c:554:46 in pdf_parse_string
Shadow bytes around the buggy address:
  0x0ff41f69ddb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff41f69ddc0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff41f69ddd0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff41f69dde0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0ff41f69ddf0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0ff41f69de00:[fa]fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0ff41f69de10: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0ff41f69de20: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0ff41f69de30: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0ff41f69de40: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0ff41f69de50: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==20240==ABORTING
```
---------

valgrind log:
=====================
```
➜  heap-overflow git:(master) ✗ valgrind --leak-check=full ~/github/clamav-devel/clamscan/clamscan ./id:000000,sig:06,src:002454,op:havoc,rep:32 
==9179== Memcheck, a memory error detector
==9179== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
==9179== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
==9179== Command: /home/varsleak/github/clamav-devel/clamscan/clamscan ./id:000000,sig:06,src:002454,op:havoc,rep:32
==9179== 
LibClamAV Warning: Cannot dlopen libclamunrar_iface: file not found - unrar support unavailable
LibClamAV Warning: cli_load: unknown extension - skipping /usr/local/share/clamav
==9179== Invalid read of size 1
==9179==    at 0x46B414: pdf_parse_string (pdfng.c:554)
==9179==    by 0x46C342: pdf_parse_array (pdfng.c:995)
==9179==    by 0x46BE7A: pdf_parse_dict (pdfng.c:801)
==9179==    by 0x468740: pdf_extract_obj (pdf.c:955)
==9179==    by 0x46A70F: cli_pdf (pdf.c:2510)
==9179==    by 0x407CF0: cli_scanpdf (scanners.c:1710)
==9179==    by 0x42BCC1: magic_scandesc (scanners.c:3014)
==9179==    by 0x42C5F0: cli_base_scandesc (scanners.c:3230)
==9179==    by 0x42D3A4: cli_magic_scandesc (scanners.c:3239)
==9179==    by 0x42D3A4: scan_common (scanners.c:3471)
==9179==    by 0x42D488: cl_scandesc_callback (scanners.c:3589)
==9179==    by 0x4180F4: scanfile (manager.c:392)
==9179==    by 0x419D03: scanmanager (manager.c:1203)
==9179==  Address 0x402c000 is not stack'd, malloc'd or (recently) free'd
==9179== 
==9179== 
==9179== Process terminating with default action of signal 11 (SIGSEGV)
==9179==  Access not within mapped region at address 0x402C000
==9179==    at 0x46B414: pdf_parse_string (pdfng.c:554)
==9179==    by 0x46C342: pdf_parse_array (pdfng.c:995)
==9179==    by 0x46BE7A: pdf_parse_dict (pdfng.c:801)
==9179==    by 0x468740: pdf_extract_obj (pdf.c:955)
==9179==    by 0x46A70F: cli_pdf (pdf.c:2510)
==9179==    by 0x407CF0: cli_scanpdf (scanners.c:1710)
==9179==    by 0x42BCC1: magic_scandesc (scanners.c:3014)
==9179==    by 0x42C5F0: cli_base_scandesc (scanners.c:3230)
==9179==    by 0x42D3A4: cli_magic_scandesc (scanners.c:3239)
==9179==    by 0x42D3A4: scan_common (scanners.c:3471)
==9179==    by 0x42D488: cl_scandesc_callback (scanners.c:3589)
==9179==    by 0x4180F4: scanfile (manager.c:392)
==9179==    by 0x419D03: scanmanager (manager.c:1203)
==9179==  If you believe this happened as a result of a stack
==9179==  overflow in your program's main thread (unlikely but
==9179==  possible), you can try to increase the size of the
==9179==  main thread stack using the --main-stacksize= flag.
==9179==  The main thread stack size used in this run was 8388608.
==9179== 
==9179== HEAP SUMMARY:
==9179==     in use at exit: 275,592 bytes in 3,769 blocks
==9179==   total heap usage: 5,420 allocs, 1,651 frees, 503,950 bytes allocated
==9179== 
==9179== 144 bytes in 1 blocks are possibly lost in loss record 589 of 660
==9179==    at 0x4C2FB55: calloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==9179==    by 0x5095AD: cli_calloc (others_common.c:217)
==9179==    by 0x42CFA5: scan_common (scanners.c:3429)
==9179==    by 0x42D488: cl_scandesc_callback (scanners.c:3589)
==9179==    by 0x4180F4: scanfile (manager.c:392)
==9179==    by 0x419D03: scanmanager (manager.c:1203)
==9179==    by 0x412D93: main (clamscan.c:161)
==9179== 
==9179== LEAK SUMMARY:
==9179==    definitely lost: 0 bytes in 0 blocks
==9179==    indirectly lost: 0 bytes in 0 blocks
==9179==      possibly lost: 144 bytes in 1 blocks
==9179==    still reachable: 275,448 bytes in 3,768 blocks
==9179==         suppressed: 0 bytes in 0 blocks
==9179== Reachable blocks (those to which a pointer was found) are not shown.
==9179== To see them, rerun with: --leak-check=full --show-leak-kinds=all
==9179== 
==9179== For counts of detected and suppressed errors, rerun with: -v
==9179== ERROR SUMMARY: 2 errors from 2 contexts (suppressed: 0 from 0)
[1]    9179 segmentation fault  valgrind --leak-check=full ~/github/clamav-devel/clamscan/clamscan
```
