#include "c_example.h"

#include <stdio.h>
void print_c()
{
    printf("Test c module\n");
}
const char *get_c_desc()
{
    return "I'm c swig test.";
}