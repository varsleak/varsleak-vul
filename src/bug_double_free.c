/**
 * Test that a too large image doesn't trigger an double-free when written
 * to memory.
 */


#include "gd.h"
#include "gdtest.h"


int main(int argc, const char * argv[])
{
    gdImagePtr im1 = 0, im2 = 0;
    FILE *fp = 0;
    int size = 0;

    if (argc != 2) {

        printf("Usage: %s path/to/tests\n", argv[0]);
    }

    fp = fopen(argv[1], "rb");

    if (fp) {

        while (__AFL_LOOP(2000))  {

            fseek(fp, 0, SEEK_SET);

            im1 = gdImageCreateFromJpeg(fp);

            if (im1) {
                im2 = gdImageWebpPtr(im1, &size);
                if (im2){
                   gdImageDestroy(im2); 
                   im2 = 0;
                }
                gdImageDestroy(im1);
                im1 = 0;
            }
        }
        fclose(fp);
        fp = 0;
    }

    return 0;
}


