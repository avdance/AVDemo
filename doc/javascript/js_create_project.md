### 通过nvm (node version manager)管理Node
   
 Node 安装可以用官网的 Installer 安装，也可以通过 Node version manager 来安装。本文重点是介绍后者，这也是官方强烈推荐的方式。因为，在项目开发的过程中，对于不同的项目需求，往往需要不同的 Node 版本。而 Node 又是如火如荼的更新着，变化太快，我们往往希望体验新版本的特性，但又想在某些项目企图通过老版本保证稳定性，所以有一个 Node version manager 显得尤为重要。

   具体安装指导比较简单，可以参考官方文档：https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

   nvm 支持 linux，macos，windows。作者本人安装的是windows。

   windows 安装路径：https://github.com/coreybutler/nvm-windows/releases

   本来在 windows 企图通过 Cygwin 来安装，可惜不支持。

#### nvm 基本命令

查看nvm版本：nvm -v

查看安装的node：nvm list

安装node: nvm install <版本号>, 例如：nvm install v10.15.1

卸载node: nvm uninstall <版本号>

应用node: nvm use <版本号>

例如：


### 一个 js 前端工程需要哪些工作

经过多年的发展，js也不再是被人诟病为随意、裸奔的那样种种了。。。。

尤其是随着es6的出现，Node.js的出现，程序员的工程理念也发生了很大的变化。工程构建需要流程化，自动化，模块化，软件仓库。代码要lint，一套代码希望在Client、Server同时工作等等。

构建一个前端工程，最基本需要几部分工作：

- 选择一个工程构建工具，webpack, grunt, gulp。

- 编译，为了兼容不同浏览器 ES6 到 ES5 转码。比如 babel。

- Lint，静态检查语法错误。

- browserify, 允许用 Node.js 的方式编写浏览器执行的代码。

- uglify, 代码压缩。

#### 工程目录结构

我们创建一个目录，helloworld-js

windows 命令提示符进入，执行 npm init, 生成一个package.json文件，这样工程设置建好了。

然后，规划目录结构。大概如下：

```javascript
+-hellworld-js
    +--+ build
    +--+ lib
    +--+ test
    +--- package.json
    +--- gulpfile.js
    +--- .jshintrc
    +--- .babelrc

    build, lib, test 都是目录，其他都是普通文件。build 是生成编译后生成文件的。
```

#### gulp

gulp 是一个流式构建工具，充分利用了 pipe 的威力(相对于 grunt，是通过生成中间文件的方式)。

官方链接：https://gulpjs.com/docs/en/getting-started/quick-start

支持的几个函数：

src() 读取源文件

dest() 生成目标文件

series() 串行执行任务

paralles() 并行执行任务

##### 安装

npm install gulp --save-dev

npm install gulp-cli --save-dev

##### gulp3 和 gulp4 在 task 依赖上的差异

使用 gulp 自动构建 JavaScript 项目，需要在工程目录下创建一个 gulpfile.js 文件，编写task执行函数。

语法都是 JavaScript 语法，非常方便。

gulp3:

```javascript
gulp.task('lint', (done)=>{
   done();
});

gulp.task('default', ['lint']);// 数组的方式
```
gulp4:

```javascript
gulp.task('lint', ()=>{

});

gulp.task('default', gulp.series('lint'));//改成内部函数调用
```
#### jshint

jshint 静态 JavaScript 代码检查工具，从 jslint 演化而来。

从事过程 C/C++ 工作的人都知道，有一个 pc-lint 的工具，彼此类似。

主要就是对代码静态检查，包括语法合法性，编程风格(比如，变量命名)，往往能发现很多低级错误，极大提高了工作效率。

- 配合 gulp，需要安装 gulp-jshint 插件。 npm install gulp-jshint --save-dev

- 创建一个 .jshintrc 文件，编写检查规则。

对于浏览器内置对象，比如 XMLHttpRequest 会报类似下面的错误，

“line 15, col 19, 'XMLHttpRequest' is not defined.”

解决这个错误，只需要在脚本开头增加“/* jshint browser: true */”，即可。

一些配置使用，可以参考：https://jshint.com/docs/

#### babel 

babel 主要是将符合 ECMAScript 2015+ 标准的代码转换成兼容低版本浏览器的代码。

安装：

npm install gulp-babel @babel/core @babel/preset-env --save-dev

babel 配置，需要创建 .babelrc 文件，内容如下：
```javascript
{
    "presets":["@babel/env"],
    "plugins": ["@babel/plugin-transform-classes"]
}
```

babel 可以支持很多插件，做很多事情，可以参考官方文档：

https://babeljs.io/docs/en/index.html

#### browserify

Node.js 通过 require('/xxx') 的方式来引入其他模块，但是浏览器不支持。然而，Node.js 目前这么火，有那么多模块可以使用，方便客户端代码的编写。我们如何才能受益于 Node.js 社区呢？需要通过 browserify。

只要我们给 browserify 指定一个入口文件，它就会把所有引入的模块都打包在一起，变成一个 bundle。

安装：npm install browserify --save-dev

配合 gulp 使用的话，需要在 task 中做如下调用:
```javascript
gulp.task('bundle', (done) =>{
    console.log('browserify...');
    
    browserfiy({
        entries      : './build/lib-es5/index.js',
        extensions   : [ '.js' ],
        standalone: 'helloworld',
        debug        : false,
		// Required for watchify (not used here).
		cache        : null,
		// Required for watchify (not used here).
		packageCache : null,
		// Required to be true only for watchify (not used here).
		fullPaths    : false
    })
    .bundle()
    .pipe(source('helloworld-min.js'))
    .pipe(buffer())
    .pipe(rename('helloworld-min.js'))    
    .pipe(gulp.dest('build'));

    done();
});

注意！！！

在浏览器使用的过程中，必须要指定 standalone: 'helloworld', 否则导出的模块不会添加到全局对象中，浏览器访问不到。
```

参考文档：https://github.com/browserify/browserify-handbook

#### uglify

uglify 是对 JavaScript 代码进行压缩瘦身，这样能加快浏览器的加载速度，可以节省客户端流量。

安装：npm install gulp-uglify --save-dev

### Demo 编写

```javascript 
git clone https://github.com/avdance/AVDemo.git
cd AVDemo/code/helloworld-js
gulp

然后将 build 目录下面的 hellowrld-min.js 拷贝在 test 目录下面，

进入 test 目录，双击 index.html ，在浏览器调试模式下会输出：
I am from index
index.html:15 hello = 1

```

#### demo调试过程中遇到的问题

##### getter 方法使用
  
```javascript
getter方法是在es5中就支持的。

class TestGetter{
    constructer(info){
        this.info = info;
    }

    get info(){
        return this.info;
    }
}
var tg = new TestGetter('test');
cosole.log(tg.info);//就像访问普通属性一样
```

参考：https://stackoverflow.com/questions/31999259/what-is-the-get-keyword-before-a-function-in-a-class

##### browserify

导出的接口，浏览器中是Undefined，需要设置 standalone 选项。

参考：https://stackoverflow.com/questions/23296094/browserify-how-to-call-function-bundled-in-a-file-generated-through-browserify



##### import 接口

```javascript
// test1.js
export default class Test1{
    constructor(info){
        this.info = info;
    }
    get info(){
        return this.info;
    }
}

// test2.js
export default class Test2{
    constructor(info){
        this.info = info;
    }

    get info(){
        return this.info;
    }
}

// index.js
import * as test1 from './test1';
import * as test2 from './test2';

export {test1, test2};
```

如上例子，index.js 中导出的 test1 ，test2，在访问 info 属性的时候，需要，

var t1 = new test1.Test1();

t1.info;

为什么不是如下形式？

var t1 = new test1();

t1.info;

### 参考文献

gulp 工程构建：https://www.engineyard.com/blog/client-side-javascript-project-gulp-and-browserify
