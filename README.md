# vul list

## LIBGD version 2.2.4 
`

	#include "gd.h"
	#include "gdtest.h"


	int main(int argc, const char * argv[])
	{
	    gdImagePtr im1 = 0, im2 = 0;
	    FILE *fp = 0;
	    int size = 0;

	    char buf[512] = { 0 };

	    getcwd(buf, sizeof(buf));

	    if (argc != 2) {
		printf("Usage: %s path/to/tests\n", buf);
	    }

	    while(__AFL_LOOP(2000)){

		fp = fopen(argv[1], "rb");
		if (fp){
		    
		    im1 = gdImageCreateFromJpeg(fp);
		    
		    fclose(fp);

		    if (im1){

		        im2 = gdImageWebpPtr(im1, &size);

		        gdImageDestroy(im1);

		        if (im2){

		            gdImageDestroy(im2);

		        }
		    }

		}
    }

    return 0;
}
`

	valgrind log:
		➜  varsleak-vul git:(master) ✗ valgrind --leak-check=full ~/github/libgd/gcc_build/Bin/test_webp_bug_double_free ./testcases/emboss.jpg                          
		==13344== Memcheck, a memory error detector
		==13344== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
		==13344== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
		==13344== Command: /home/varsleak/github/libgd/gcc_build/Bin/test_webp_bug_double_free ./testcases/emboss.jpg
		==13344== 
		==13344== Invalid read of size 8
		==13344==    at 0x4E49F46: gdImageDestroy (gd.c:394)
		==13344==    by 0x400B4C: main (bug_double_free.c:41)
		==13344==  Address 0x253246464952 is not stack'd, malloc'd or (recently) free'd
		==13344== 
		==13344== 
		==13344== Process terminating with default action of signal 11 (SIGSEGV)
		==13344==  Access not within mapped region at address 0x253246464952
		==13344==    at 0x4E49F46: gdImageDestroy (gd.c:394)
		==13344==    by 0x400B4C: main (bug_double_free.c:41)
		==13344==  If you believe this happened as a result of a stack
		==13344==  overflow in your program's main thread (unlikely but
		==13344==  possible), you can try to increase the size of the
		==13344==  main thread stack using the --main-stacksize= flag.
		==13344==  The main thread stack size used in this run was 8388608.
		==13344== 
		==13344== HEAP SUMMARY:
		==13344==     in use at exit: 82,234 bytes in 2 blocks
		==13344==   total heap usage: 167 allocs, 165 frees, 709,201 bytes allocated
		==13344== 
		==13344== LEAK SUMMARY:
		==13344==    definitely lost: 0 bytes in 0 blocks
		==13344==    indirectly lost: 0 bytes in 0 blocks
		==13344==      possibly lost: 0 bytes in 0 blocks
		==13344==    still reachable: 82,234 bytes in 2 blocks
		==13344==         suppressed: 0 bytes in 0 blocks
		==13344== Reachable blocks (those to which a pointer was found) are not shown.
		==13344== To see them, rerun with: --leak-check=full --show-leak-kinds=all
		==13344== 
		==13344== For counts of detected and suppressed errors, rerun with: -v
		==13344== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
		[1]    13344 segmentation fault  valgrind --leak-check=full  ./testcases/emboss.jpg

 	
 
	

	
`
	poc:
`
	no

	[testcases] (https://github.com/varsleak/varsleak-vul.git)
	

