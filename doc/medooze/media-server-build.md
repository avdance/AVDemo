# build

media-server是medooze媒体部分实现，用c++实现，由于用了c++11的语法，所以需要高版本gcc编译器。

github路径：https://github.com/medooze/media-server.git

下面将记录在 ubuntu18.04 gcc 7.3.0环境下面的编译过程。

选择的分支是: optimications

## 依赖库

可以一口气安装完。

```c
sudo apt-get install libxmlrpc-c++8-dev
sudo apt-get install libgsm1-dev
sudo apt-get install libspeex-dev
sudo apt-get install libopus-dev
 
sudo apt-get install libavresample-dev
sudo apt-get install libx264-dev
sudo apt-get install libvpx-dev
sudo apt-get install libswscale-dev
sudo apt-get install libavformat-dev
sudo apt-get install libmp4v2-dev

sudo apt-get install libgcrypt11-dev
sudo apt-get install libssl1.0-dev
 ```
 
## 获取代码及配置

```c

git clone https://github.com/medooze/media-server.git

注意获取的时候，需要指定optimications。本人是先获取master分支，遇到问题后，又再次切换的。

cd media-server

vim config.mk

做如下修改：

#################################
# Config file
##################################
LOG		  = yes
DEBUG 		  = yes
SANITIZE          = no
STATIC		  = no
VADWEBRTC	  = yes
SRCDIR		  = /home/haska/work/media-server//!!!注意，这里需要修改成media-server的完整路径，后面不能有空格
TARGET		  = /usr/local
IMAGEMAGICK       = no

```


## 编译common_audio

common_audio，依赖ninja，所以需要安装ninja-build

```c
sudo apt-get install ninja-build
cd media-server/ext/out/Release
ninja
```

## 编译media-server

经过前面的步骤，就简单多了。注意：需要依赖libcommon_audio.a，所以需要提前编译。

```c
cd media-server
make
```
 
# 遇到的问题

1. master 分支下面 include/EventLoop.h依赖了一个Buffer.h文件，但是在include下面并没有。
   
   解决办法：就是切换到optimizations分支   
   
2. /home/haska/work/media-server/include/rtmp/rtmphandshake.h:61:11: error: aggregate ‘HMAC_CTX ctx’ has incomplete type and cannot be defined
   
   解决办法：安装libssl1.0-dev
   
