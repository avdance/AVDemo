# 介绍

   有人说javascript是最优美的语言，确实也是。然而，了解过javascript发展史的人都知道，在早年的浏览器大战中能够脱颖而出，也绝非易事。更何况，javascript的标准化过程也是曲折艰难。然而，自从Ryan Dahl在2009年js峰会上介绍了Node.js以后，让程序员们大开眼界。Node.js融合了google的v8 javascript引擎,引入了服务器端常用的事件处理机制，使得javascript语言也可以用来实现服务端程序，前端程序员写一个服务器不再是一件空难的事情。当然，业界有很多项目也尝试用Node.js来实现服务器逻辑。

   然而，javascript毕竟是脚本语言，在一些计算密集型，实时性要求高的产品中，采用Native(主要是通过c++)实现这些逻辑显得尤为重要。

   Node.js本身常用的一种叫Nan(Native Abstract for Node.js)的方式，非常不错。其github的项目地址：https://github.com/nodejs/nan

   而，本文要介绍的是通过SWIG来实现javascript和c++的融合。

# SWIG

## 介绍

   SWIG的官网地址是：http://www.swig.org

   SWIG主要是一个接口编译器，将C/C++程序暴露的API描述在一个后缀是(.i)的文件里面，然后通过swig编译器生成c++源代码的一个wrapper，
  
   生成的代码可以在脚本语言的解释器平台上执行，从而实现了脚本语言调用c/c++程序API的目的。

   SWIG只是代码生成工具，不需要依赖任何平台和库。

   SWIG支持的脚本语言有很多：比如tcl，java，php5,php7，python等很多，当然也包含javascript了。

   SWIG项目的意义，以及很多优势在官网里面有详细的介绍，里面也有很多参考资源，可以方便进一步的学习。

   本文我们只是通过一个简单的demo来说明，swig的基本用法。

## 安装

   目前支持SWIG的系统有windows，mac，cygwin，linux，等很多unix-like系统。

   作者本人用的是cygwin环境。

   具体安装过程步骤相对简单，参考官网说明即可。

   安装完成后，打开命令行做如下的测试：

```c
   $ swig -version

    SWIG Version 3.0.12

    Compiled with g++ [x86_64-unknown-cygwin]

    Configured options: +pcre

    $ swig --help
     Target Language Options
     -allegrocl      - Generate ALLEGROCL wrappers
```

## SWIG对C/C++的支持

   因为SWIG主要目的是实现不同语言的互通，所以并没有完全支持c++语言的所有特性。比如，c++的多重继承，运算符重载，成员函数重载等。

   当然，基本常用的语法都是支持，比如虚函数，多态，还有c++11新标准也支持。

## 接口文件说明

   swig的接口文件如下，文件后缀名是(.i).

```c
  1 %module example
  2 %{
  3 #include "c_example.h"
  4 #include "shape.h"
  5 %}
  6
  7 extern void print_c();
  8 extern const char *get_c_desc();
  9
 10 %include "shape.h"
  
```

  %module : 是模块说明指令，这个是必须的，我们在node.js中通过require引入需要的。

  %{ %} : 中包含的内容，swig是不做任何处理的，直接导入到最终生成的文件中。这个类似yacc/bison的的%{ %}指令。所以，我们是可以在这个指令块内，写一些C/C++代码的。例子中 c_example.h是一个c语言API的声明。shape.h是一个c++头文件的声明，包含了继承，多态，静态成员变量等特性。

   第7-8行：是暴露给脚本语言访问的的接口。这里其实就是一个wrapper。

   第10 行：用了%include 指令，这是将shape.h中的所有接口都暴露给脚本语言。如果说你原始头文件的所有接口都暴露，可以直接这样包含。如果，原始头文件中包含的内容太多不想暴露，或者是包含了swig不支持的语法，需要像7-8行那样，做一个wrapper。

## 具体操作

### swig代码生成

   写完接口文件，我们就可以用swig生成代码。如下，

   swig.exe -c++ -javascript -node example.i

   执行完上面的命令会在当前目录下面生成一个example_wrap.cxx的文件。

   -c++ : 只是表示native代码是c++代码，这里需要说明的是C/C++语言都需要增加此选项。

   -javascript： 表示生成的脚本语言是javascript语言。

   -node：是执行javascript的引擎。

   最后是接口文件名称。

   特别说明：这里的c/c++语言后缀必须是c++语言的文件后缀，比如(*.cxx, *.cpp)等，否则编译的时候会出错。

### 构建Native编译工程

   这里怎么构建Node.js工程，以及package.json的说明就不再讲了。
   
   构建Node.js native 编译, 创建一个swig-js工程目录，结构如下：

```c
swig-js
│  binding.gyp //Native build 文件
│  index.js //js测试文件
│  package-lock.json
│  package.json
└─src
     | c_example.cxx
     | c_example.h
     | example.i // 接口文件
     | example_wrap.cxx // swig生成的文件
     | shape.cxx
     | shape.h
```

   首先, 创建binding.gyp文件 , 内容如下：

```c
{
  "targets": [
    {
      "target_name": "example",
      "include_dirs":
      [
          'src'
      ],
      "sources":
       [
            "src/c_example.cxx",
            "src/shape.cxx",
            "src/example_wrap.cxx"
       ]
    }
  ]
}
```

    其次，编译, 经过下面过程的编译，就生成了native代码。

```c
   npm install node-gyp -g //安装native build工具

   node-gyp configure

   node-gyp build
```

   最后，测试，index.js测试代码如下：

```c

var example = require('./build/Release/example');

example.print_c();

console.log(example.get_c_desc());

var shape = new example.Circle(2);

shape.move(2, 3);

let square = new example.Square(5);

console.log('The square area='+square.area());

执行：

$ node index.js
I'm c swig test.
Test c module
Move from(0, 0) to (2, 3)
The square area=25
```  

    经过上面的步骤，通过swig 进行javascript和c++的融合开发就完成了。

## 特别说明

   从node7.0开始，删除了一些api，比如, v8::Object::GetHiddenValue 。因为swig的开发目前还有支持最新的的node版本，所以需要node 7.0以下的版本来测试。

   笔者用的是v6.17.1 node版本。


