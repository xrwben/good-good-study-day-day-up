## http缓存

参考链接： [https://zoo.team/article/http-cache](https://zoo.team/article/http-cache)

HTTP 缓存分为 2 种，一种是强缓存，另一种是协商缓存。主要作用是可以加快资源获取速度，提升用户体验，减少网络传输，缓解服务端的压力

![''](http://zcy-cdn.oss-cn-shanghai.aliyuncs.com/f2e-assets/c3c22890-140e-4cef-9999-068585b6c31c.jpg?x-oss-process=image/quality,Q_75)


### 强缓存

不发送请求到服务器，直接读取浏览器本地缓存，http状态码200，分为Disk Cache和Memory Cache，由Expires、Cache-Control、Pragma决定

**Expires**

Expires是http/1.1中的属性，值是一个http日期（Expires: Wed, 16 Sep 2020 08:27:19 GMT），在浏览器发送请求时会把系统时间和Expires比较，如果系统时间超过Expires值则缓存失效，优先级最低

**Cache-Control**

Cache-Control是http/1.1中新增的属性，在请求头和响应头中都可以使用，属性值有：

- max-age： 距离发起的时间的秒数，超过则缓存失效，例子max-age=86400

- no-cache： 不使用强缓存，例cache-control: no-cache

- no-store： 禁止使用缓存包括协商缓存，每次都需要像服务器请求最新的资源

- private： 专用于个人的缓存，中间代理，CDN等无法缓存

- public: 响应可以被中间代理、CDN等缓存

- must-revalidate： 在缓存过期前可以使用，过期后必须向服务器验证

**Pragma**

Pragma只有no-cache一个属性值，效果和Cache-control中的no-cache一致，不使用强缓存，需要与服务器验证缓存是否新鲜，优先级最高


### 协商缓存

当不走强缓存时，且在请求头中设置了If-Modified-Since或者If-None-Match的时候，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了则会返回304，并且响应头会设置Last-Modified或者ETag属性


**ETag/If-None-Match**

ETag/If-None-Match的值为一串hash码，例etag: W/"5e5-16dc85d51e1"，代表一个资源的标志符，当服务端的文件变化时它的hash码也会随之改变，通过请求头中的If-None-Match和当前文件的hash值比较，如果相等则表示命中协商缓存

ETag有强弱校验之分，如果以 `W/` 开头的一串字符串则表明为弱校验，只有服务器上的文件差异(根据ETag计算方式来决定)达到能够触发hash值变化的时候，才会真的请求资源，否则返回304并加载浏览器缓存



**Last-Modified/If-Modified-Since**

Last-Modified/If-Modified-Since的值表示文件的最后修改时间，第一次请求服务端的资源后会把最后的修改时间放到Last-Modified的响应头中，当第二次请求的时候，请求头会带上上一次请求响应中的Last-Modified的时间，并放到If-Modified-Since请求头属性中，服务端根据文件的最后一次修改时间和If-Modified-Since值比较，如果相等则返回304并加载缓存，优先级低


**异同**

- 如果文件修改频率秒级以下，Last-Modified/If-Modified-Since会错误返回304

- 如果文件修改但内容没有变化时，比如空格啥的格式化，Last-Modified/If-Modified-Since会错误返回304