#ifndef _SHAPE_H_
#define _SHAPE_H_

class Shape {
public:
  Shape():x_(0), y_(0){}
  Shape(double x, double y):x_{x}, y_{y} {
    nshapes++;
  }
  virtual ~Shape() {
    nshapes--;
  }

  void move(double dx, double dy);
  virtual double area(void) = 0;
  virtual double perimeter(void) = 0;

private:
  double  x_, y_;

  static  int nshapes;
};

class Circle : public Shape {
private:
  double radius;
public:
  Circle(double r) : radius(r) { }
  virtual double area(void);
  virtual double perimeter(void);
};

class Square : public Shape {
private:
  double width;
public:
  Square(double w) : width(w) { }
  virtual double area(void);
  virtual double perimeter(void);
};
#endif//_SHAPE_H_
