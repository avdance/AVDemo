
# Medooze 分析

## MediaServer
MediaServer 是一个服务器，它可以创多个 Endpoint。 

## Endpoint

每个 Endpoint 都代表着与一个 **conference** 或者 **Session** ？**这个还需要验证**。

### Endpoint的成员变量
- ip: 提供服务的 IP 地址
- bundle: **RTPBundleTransport 对象，这个类还要单独再分析**，按协议其应该是指定音频数据与视频数据混用。
- transports: transport 对象的集合，在下面会有详细介绍
- candidate: CandidateInfo对象，表示服务端的一条通路（Candidate）。
- fingerprint: 从 MediaServer 中得到的指纹，用于验证 DTLS 证书的有效性。
- emitter: 事件发送器: 用于发送事件？这个还要再确认。


## Transport

每个 Transport 代表服务端的一个candidate(ip, port)与客户端一组 candidate(ip, port)的连接。这组连接使用同一个 DTLS 协议会话。

每个 Tansport允许发送或接收一组输入和输出的RTP流。

**有几点需要注意的地方：**

- 创建的输入流必须是在远端SDP（客户端SDP）中描述的流，因为任何带有未知ssrc的RTP包都将被丢弃。
- 当你创建输出流时，Transport会在内部为不同RTP流分配 ssrc 以避免突冲。
- 你可以从发送到客户端的 SDP 描述信息中抽取流信息。
- 为了决定如何路由，将多个输出流与它的 Transport 输入流进行绑定？？？

## 补充知识

要弄清楚的问题

- PeerConnectionServer的作用


## JS基础知识

- `class`是JS中定义类的，这与C++类似
- 其构造函数名为 `constrctor`，而 C++中其类名
- 成员变量是在 constructor 中定义并赋值的，而 C++有专门的成员变量定议域

