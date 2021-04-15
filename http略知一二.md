## http发展史

**超文本传输协议(HyperText Transfer Protocol)**  [参考链接](https://juejin.im/post/6844903988953874445)

!['HTTP1.1也是当前使用最为广泛的HTTP协议'](https://upload-images.jianshu.io/upload_images/23495033-f126b2abb9a4e899?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### http1.0与http1.1

- **缓存处理**：http1.0主要使用Expires、If-Modified-since作为缓存判断的标准，而http1.1则引入ETag、If-None-Match等

- **带宽优化及网络连接的使用**：HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持*断点续传*功能，HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接

- **错误通知的管理**：http1.1增加了更多的状态响应码，如409(请求的资源与资源的当前状态发生冲突)、410(服务器上的某个资源被永久性的删除)等

- **Host头处理**：HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）

- **长连接**： HTTP 1.1支持长连接（PersistentConnection）和请求的流水线（Pipelining）处理，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，其中长连接也就是对应在HTTP1.1中的Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点


### 常见的http1.1的请求和响应在浏览器中的截图：

![请求](https://upload-images.jianshu.io/upload_images/23495033-24f6bd9849202f6c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**典型的请求头有**：

Accept：用于告诉服务器，客户机支持的数据类型

Accept-Charset：用于告诉服务器，客户机所采用的编码

Accept-Encoding：用于告诉服务器，客户机支持的数据压缩格式

Accept-Language：客户机的语言环境

Host：客户机通过这个头告诉服务器，想访问的主机名

If-Modified-Since：客户机通过这个头告诉服务器，资源的缓存时间

Referer：客户机通过这个头告诉服务器，它是从哪个资源来访问服务器的（防盗链）

User-Agent：客户机通过这个头告诉服务器，客户机的软件环境

Cookie：客户机通过这个头可以向服务器带数据


![响应](https://upload-images.jianshu.io/upload_images/23495033-e925e92b61eed41d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**典型的响应头部有**：

Location：这个头配合302状态码使用，用于告诉客户找谁

Server：服务器通过这个头，告诉浏览器服务器的类型

Content-Encoding：服务器通过这个头，数据的压缩格式

Content-Length：服务器通过这个头，告诉浏览器回送数据的长度

Content-Type：服务器通过这个头，告诉浏览器回送数据的类型

Last-Modified：服务器通过这个头，告诉浏览器当前资源缓存时间

Refresh：服务器通过这个头，告诉浏览器隔多长时间刷新一次

Content-Disposition：服务器通过这个头，告诉浏览器以下载方式打开数据

Transfer-Encoding：服务器通过这个头，告诉浏览器数据的传送格式

ETag：…

Expires：服务器通过这个头，告诉浏览器把回送的资源缓存多长时间，-1或0，则是不缓存

Cache-Control：no-cache

Pragma:no-cache 服务器通过以上两个头，也是控制浏览器不要缓存数据



#### http1.x缺陷

- 在传输数据时，每次都需要重新建立连接，无疑增加了大量的延迟时间

- 传输的内容都是明文，一定程度上无法保证数据的安全性

- header里携带的内容过大，在一定程度上增加了传输的成本

- 虽然HTTP1.1支持了keep-alive，来弥补多次创建连接产生的延迟，但是keep-alive使用多了同样会给服务端带来大量的性能压等



### https

> HTTPS: HTTP + TLS

- https则是具有安全性的TLS加密传输协议

- http端口80，https默认端口443



### http2.0

- **多路复用**：即连接共享，即每一个request都是是用作连接共享机制的。一个request对应一个id，这样一个连接上可以有多个request，每个连接的request可以随机的混杂在一起，接收方可以根据request的 id将request再归属到各自不同的服务端请求里面。多路复用原理和keep alive区别如下图：

!['多路复用'](https://upload-images.jianshu.io/upload_images/23495033-ad579d2dd4958d9c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> keep-alive与多路复用区别

	[区别案例](https://http2.akamai.com/demo)

	* keep-alive虽然也只建立一次链接，但请求是串行有序的，只是减少了建立链接的时间，而且浏览器本身会限制最大TCP连接数为6个左右

	* http2数据流为二进制流，并行操作传输

- **Header压缩**：HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小

- **服务端推送**：同SPDY一样，HTTP2.0也具有Server Push功能

- **新的二进制格式**：HTTP1.x的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮


### http3.0

> HTTP3.0，也称作HTTP over QUIC。HTTP3.0的核心是QUIC(读音quick)协议，传统http协议是基于传输层TCP的协议，而QUIC是基于传输层UDP上的协议，可以定义成：HTTP3.0基于UDP的安全可靠的HTTP2.0协议

- **减少了TCP三次握手及TLS握手时间**

- **多路复用丢包时的线头阻塞问题**

- **优化重传策略**

- **流量控制**

- **连接迁移**


### 在浏览器地址栏键入URL，按下回车之后会经历以下流程

1、浏览器向DNS 服务器请求解析该 URL 中的域名所对应的 IP 地址

2、解析出 IP 地址后，根据该 IP 地址和默认端口 80，和服务器建立 TCP 连接

3、浏览器发出读取文件(URL 中域名后面部分对应的文件)的HTTP 请求，该请求报文作为 TCP 三次握手的第三个报文的数据发送给服务器

4、服务器对浏览器请求作出响应，并把对应的 html 文本发送给浏览器

5、释放 TCP 连接

6、浏览器将该 html 文本并显示内容


### HTTP常用状态码及含义

* 101： websocket连接
* 200： 成功返回完成
* 206： 成功返回但未完成，请求长视频音频可能出现
* 301： 永久重定向
* 302： 临时重定向
* 304： 缓存
* 400： 请求参数错误
* 401： 没有权限
* 403： 禁止访问
* 404： 访问地址没找到
* 500： 服务端返回错误
* 504： 服务端无法处理请求