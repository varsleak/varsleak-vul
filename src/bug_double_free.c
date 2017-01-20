/**
 * Test that a too large image doesn't trigger an double-free when written
 * to memory.
 */


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
        
        printf("Usage: %s path/to/tests\n", buf);
    }

    //while(__AFL_LOOP(2000)){

        fp = fopen(argv[1], "rb");
        if (fp){
            
            im1 = gdImageCreateFromJpeg(fp);
            fclose(fp);

            if (im1){

	            gdImageWebp(im1, "AAA.webp");

                gdImageDestroy(im1);

            }

        }
    //}

    return 0;
}


