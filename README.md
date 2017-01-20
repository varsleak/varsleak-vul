vul list
========

## LIBGD version 2.2.4 
`

	#include "gd.h"
	#include "gdtest.h"


	int main(int argc, const char * argv[])
	{
	    gdImagePtr im1 = 0;
	    FILE *fp = 0;
	    int size = 0;

	    char buf[512] = { 0 };

	   

	    if (argc != 2) {
	    
	     	getcwd(buf, sizeof(buf));
	     	
	     	printf("Usage: %s path/to/testcase\n", buf);
	    }


		fp = fopen(argv[1], "rb");
		if (fp){
		    
		    im1 = gdImageCreateFromJpeg(fp);
		    fclose(fp);

		    if (im1){

			    gdImageWebp(im1, "AAA.webp");

		        gdImageDestroy(im1);

		    }

		}

	    return 0;
	}
`

	valgrind log:
		➜  gcc_build git:(master) ✗ valgrind --leak-check=full Bin/test_webp_bug_double_free ~/github/varsleak-vul/testcases/emboss.jpg 
		==17311== Memcheck, a memory error detector
		==17311== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
		==17311== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
		==17311== Command: Bin/test_webp_bug_double_free /home/varsleak/github/varsleak-vul/testcases/emboss.jpg
		==17311== 
		==17311== Invalid read of size 8
		==17311==    at 0x511F71A: fwrite (iofwrite.c:37)
		==17311==    by 0x4E676C7: filePutbuf (gd_io_file.c:93)
		==17311==    by 0x4E66CEB: gdPutBuf (gd_io.c:207)
		==17311==    by 0x4E755B7: _gdImageWebpCtx (gd_webp.c:225)
		==17311==    by 0x4E756B0: gdImageWebp (gd_webp.c:317)
		==17311==    by 0x400AFD: main (bug_double_free.c:36)
		==17311==  Address 0x1c0000002c is not stack'd, malloc'd or (recently) free'd
		==17311== 
		==17311== 
		==17311== Process terminating with default action of signal 11 (SIGSEGV)
		==17311==  Access not within mapped region at address 0x1C0000002C
		==17311==    at 0x511F71A: fwrite (iofwrite.c:37)
		==17311==    by 0x4E676C7: filePutbuf (gd_io_file.c:93)
		==17311==    by 0x4E66CEB: gdPutBuf (gd_io.c:207)
		==17311==    by 0x4E755B7: _gdImageWebpCtx (gd_webp.c:225)
		==17311==    by 0x4E756B0: gdImageWebp (gd_webp.c:317)
		==17311==    by 0x400AFD: main (bug_double_free.c:36)
		==17311==  If you believe this happened as a result of a stack
		==17311==  overflow in your program's main thread (unlikely but
		==17311==  possible), you can try to increase the size of the
		==17311==  main thread stack using the --main-stacksize= flag.
		==17311==  The main thread stack size used in this run was 8388608.
		==17311== 
		==17311== HEAP SUMMARY:
		==17311==     in use at exit: 359,664 bytes in 134 blocks
		==17311==   total heap usage: 163 allocs, 29 frees, 678,531 bytes allocated
		==17311== 
		==17311== LEAK SUMMARY:
		==17311==    definitely lost: 0 bytes in 0 blocks
		==17311==    indirectly lost: 0 bytes in 0 blocks
		==17311==      possibly lost: 0 bytes in 0 blocks
		==17311==    still reachable: 359,664 bytes in 134 blocks
		==17311==         suppressed: 0 bytes in 0 blocks
		==17311== Reachable blocks (those to which a pointer was found) are not shown.
		==17311== To see them, rerun with: --leak-check=full --show-leak-kinds=all
		==17311== 
		==17311== For counts of detected and suppressed errors, rerun with: -v
		==17311== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
		[1]    17311 segmentation fault  valgrind --leak-check=full Bin/test_webp_bug_double_free

 	
 
	

	
`
	poc:
`
	no

	[testcases](https://github.com/varsleak/varsleak-vul/raw/master/testcases/emboss.jpg)
	

