#include "shape.h"

#include <iostream>

int Shape::nshapes = 0;

void Shape::move(double dx, double dy)
{
    std::cout << "Move from(" << x_ <<", " << y_ << ") to (" << dx << ", " << dy << ")" << std::endl;
    x_ = dx;
    y_ = dy;    
}

double Circle::area(void)
{
    return 3.14 * radius *radius;
}
double Circle::perimeter(void)
{
    return 2*3.14*radius;
}


double Square::area(void)
{
    return width*width; 
}
double Square::perimeter(void)
{
    return 4*width;
}

