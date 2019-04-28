var example = require('./build/Release/example');

example.print_c();

console.log(example.get_c_desc());

var shape = new example.Circle(2);

shape.move(2, 3);

let square = new example.Square(5);

console.log('The square area='+square.area());