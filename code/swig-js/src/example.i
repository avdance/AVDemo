%module example
%{
#include "c_example.h"
#include "shape.h"
%}

extern void print_c();
extern const char *get_c_desc();

%include "shape.h"
