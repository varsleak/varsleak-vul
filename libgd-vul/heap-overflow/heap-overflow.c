#include <gd.h>

int main(int argc, char * argv[])
{
    gdImagePtr im = 0;
    FILE *fp = 0;
    void * im2 = 0;
    int size = 0;

    if (argc != 2) return -1;

    fp = fopen(argv[1], "rb");
    if (fp){
	    im = gdImageCreateFromGd(fp);

	    if (im){
	    	im2 = gdImageTiffPtr(im, &size);

	    	if (im2){
	    		gdFree(im2);
	    	}
	    	gdImageDestroy(im);
		}
	    
	}

    fclose(fp);

    return 0;
}
