## Reference 
[https://bugs.php.net/bug.php?id=74145](https://bugs.php.net/bug.php?id=74145) 

## Usage 
path/to/php path/to/issus74145.php path/to/issus74145.xml 

## USE ZEND ALLOC 
```
➜  php-src git:(d2eca4d) ✗ valgrind --leak-check=full sapi/cli/php ~/php720dev/bin/xmlfuzz.php ~/php720dev/bin/crash.xml
==22828== Memcheck, a memory error detector
==22828== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
==22828== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
==22828== Command: sapi/cli/php /home/varsleak/php720dev/bin/xmlfuzz.php /home/varsleak/php720dev/bin/crash.xml
==22828== 
==22828== Invalid read of size 8
==22828==    at 0x8558B4: zend_mm_check_ptr (zend_alloc.c:1384)
==22828==    by 0x85751A: _zend_mm_free_int (zend_alloc.c:2068)
==22828==    by 0x858B2B: _efree (zend_alloc.c:2440)
==22828==    by 0x7D8756: wddx_stack_destroy (wddx.c:238)
==22828==    by 0x7E0295: php_wddx_deserialize_ex (wddx.c:1206)
==22828==    by 0x7E15FE: zif_wddx_deserialize (wddx.c:1405)
==22828==    by 0x8DC464: zend_do_fcall_common_helper_SPEC (zend_vm_execute.h:558)
==22828==    by 0x8E1F8F: ZEND_DO_FCALL_SPEC_CONST_HANDLER (zend_vm_execute.h:2602)
==22828==    by 0x8DBACC: execute_ex (zend_vm_execute.h:363)
==22828==    by 0x8DBB53: zend_execute (zend_vm_execute.h:388)
==22828==    by 0x894503: zend_execute_scripts (zend.c:1341)
==22828==    by 0x7F52A0: php_execute_script (main.c:2613)
==22828==  Address 0x2ffffffb8 is not stack'd, malloc'd or (recently) free'd
==22828== 
==22828== 
==22828== Process terminating with default action of signal 11 (SIGSEGV)
==22828==  Access not within mapped region at address 0x2FFFFFFB8
==22828==    at 0x8558B4: zend_mm_check_ptr (zend_alloc.c:1384)
==22828==    by 0x85751A: _zend_mm_free_int (zend_alloc.c:2068)
==22828==    by 0x858B2B: _efree (zend_alloc.c:2440)
==22828==    by 0x7D8756: wddx_stack_destroy (wddx.c:238)
==22828==    by 0x7E0295: php_wddx_deserialize_ex (wddx.c:1206)
==22828==    by 0x7E15FE: zif_wddx_deserialize (wddx.c:1405)
==22828==    by 0x8DC464: zend_do_fcall_common_helper_SPEC (zend_vm_execute.h:558)
==22828==    by 0x8E1F8F: ZEND_DO_FCALL_SPEC_CONST_HANDLER (zend_vm_execute.h:2602)
==22828==    by 0x8DBACC: execute_ex (zend_vm_execute.h:363)
==22828==    by 0x8DBB53: zend_execute (zend_vm_execute.h:388)
==22828==    by 0x894503: zend_execute_scripts (zend.c:1341)
==22828==    by 0x7F52A0: php_execute_script (main.c:2613)
==22828==  If you believe this happened as a result of a stack
==22828==  overflow in your program's main thread (unlikely but
==22828==  possible), you can try to increase the size of the
==22828==  main thread stack using the --main-stacksize= flag.
==22828==  The main thread stack size used in this run was 8388608.
==22828== 
==22828== HEAP SUMMARY:
==22828==     in use at exit: 3,452,448 bytes in 12,037 blocks
==22828==   total heap usage: 12,454 allocs, 417 frees, 3,547,507 bytes allocated
==22828== 
==22828== LEAK SUMMARY:
==22828==    definitely lost: 0 bytes in 0 blocks
==22828==    indirectly lost: 0 bytes in 0 blocks
==22828==      possibly lost: 0 bytes in 0 blocks
==22828==    still reachable: 3,452,448 bytes in 12,037 blocks
==22828==         suppressed: 0 bytes in 0 blocks
==22828== Reachable blocks (those to which a pointer was found) are not shown.
==22828== To see them, rerun with: --leak-check=full --show-leak-kinds=all
==22828== 
==22828== For counts of detected and suppressed errors, rerun with: -v
==22828== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
[1]    22828 segmentation fault  valgrind --leak-check=full sapi/cli/php ~/php720dev/bin/xmlfuzz.php 
```

## NO ZEND ALLOC 
```
➜  php-src git:(d2eca4d) ✗ USE_ZEND_ALLOC=0 sapi/cli/php ~/php720dev/bin/crash.php 
[1]    1382 segmentation fault  USE_ZEND_ALLOC=0 sapi/cli/php ~/php720dev/bin/crash.php
➜  php-src git:(d2eca4d) ✗ USE_ZEND_ALLOC=0 valgrind --leak-check=full sapi/cli/php ~/php720dev/bin/xmlfuzz.php ~/php720dev/bin/crash.xml
==4388== Memcheck, a memory error detector
==4388== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
==4388== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
==4388== Command: sapi/cli/php /home/varsleak/php720dev/bin/xmlfuzz.php /home/varsleak/php720dev/bin/crash.xml
==4388== 
==4388== Invalid free() / delete / delete[] / realloc()
==4388==    at 0x4C2EDEB: free (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==4388==    by 0x858B01: _efree (zend_alloc.c:2437)
==4388==    by 0x7D8756: wddx_stack_destroy (wddx.c:238)
==4388==    by 0x7E0295: php_wddx_deserialize_ex (wddx.c:1206)
==4388==    by 0x7E15FE: zif_wddx_deserialize (wddx.c:1405)
==4388==    by 0x8DC464: zend_do_fcall_common_helper_SPEC (zend_vm_execute.h:558)
==4388==    by 0x8E1F8F: ZEND_DO_FCALL_SPEC_CONST_HANDLER (zend_vm_execute.h:2602)
==4388==    by 0x8DBACC: execute_ex (zend_vm_execute.h:363)
==4388==    by 0x8DBB53: zend_execute (zend_vm_execute.h:388)
==4388==    by 0x894503: zend_execute_scripts (zend.c:1341)
==4388==    by 0x7F52A0: php_execute_script (main.c:2613)
==4388==    by 0x951273: do_cli (php_cli.c:998)
==4388==  Address 0x300000000 is not stack'd, malloc'd or (recently) free'd
==4388== 
NULL
==4388== 
==4388== HEAP SUMMARY:
==4388==     in use at exit: 72,704 bytes in 1 blocks
==4388==   total heap usage: 15,263 allocs, 15,263 frees, 3,313,783 bytes allocated
==4388== 
==4388== LEAK SUMMARY:
==4388==    definitely lost: 0 bytes in 0 blocks
==4388==    indirectly lost: 0 bytes in 0 blocks
==4388==      possibly lost: 0 bytes in 0 blocks
==4388==    still reachable: 72,704 bytes in 1 blocks
==4388==         suppressed: 0 bytes in 0 blocks
==4388== Reachable blocks (those to which a pointer was found) are not shown.
==4388== To see them, rerun with: --leak-check=full --show-leak-kinds=all
==4388== 
==4388== For counts of detected and suppressed errors, rerun with: -v
==4388== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```
