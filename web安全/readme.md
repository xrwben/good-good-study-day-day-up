#### 分类

XSS（跨站脚本攻击）、Clickjacking（点击劫持）、CSRF（跨站点伪造请求攻击）、中间人攻击


#### XSS攻击

1、是什么

XSS 全称是 Cross Site Scripting(即跨站脚本)，为了和CSS区分，故叫它XSS

2、原理

指的是攻击者往Web页面里插入恶意html标签或者javascript代码，让恶意脚本直接能在浏览器中执行

3、目的

窃取Cookie

监听用户行为，比如输入账号密码后直接发送到黑客服务器

修改 DOM 伪造登录表单

在页面中生成浮窗广告

4、攻击方式

存储型：将脚本存储到了服务端的数据库，然后在客户端执行这些脚本，常见的场景是留言评论区提交一段脚本代码

反射性：指的是恶意脚本作为网络请求的一部分，如：http://liben.com?q=<script>alert("你完蛋了")</script>

文档型：不会经过服务端，而是作为中间人的角色，在数据传输过程劫持到网络数据包，然后修改里面的 html 文档，劫持方式包括WIFI路由器劫持或者本地恶意软件等


5、如何解决

对'<', '>', ';', '/'等字符做转码或过滤
```js
<script>alert('你完蛋了')</script>
转为
&lt;script&gt;alert(&#39;你完蛋了&#39;)&lt;/script&gt;
```

利用CSP，即浏览器中的内容安全策略（限制其他域下的资源加载、禁止向其它域提交数据、提供上报机制帮助我们及时发现 XSS 攻击）
```js
<meta http-equiv="Content-Security-Policy" content="script-src 'self' *.guojiang.tv *.guojiang.info *.tuho.tv *.tuho.tv *.efeizao.com cdn.staticfile.org *.cnzz.com *.geetest.com 'unsafe-inline' 'unsafe-eval'">
```

利用HttpOnly，很多 XSS 攻击脚本都是用来窃取Cookie, 而服务端设置 Cookie 的 HttpOnly 属性后，JavaScript 便无法读取 Cookie 的值
```js
document.cookie = name+"="+value+expires+"; domain=my.domain.com; path=/; HttpOnly;";
```


#### CSRF攻击

1、是什么

CSRF 全称 Cross-site request forgery(跨站请求伪造)

2、原理

伪造一个后端请求地址，诱导用户点击链接，打开黑客的网站，然后黑客利用用户目前的登录状态发起跨站请求，利用服务器的验证漏洞和用户之前的登录状态来模拟用户进行操作

3、攻击方式

自动发起get请求：<img src="https://a.com?user=liben&count=100"></img>自动发送 get 请求,获取cookie等信息

自动发起post请求：攻击者可能自己写一个表单，然后搞一段自动提交的脚本，携带相应的用户 cookie 信息，让服务器误以为是一个正常的用户在操作

4、如何解决

利用Cookie的SameSite属性(Strict、Lax、None)

利用请求头中的Origin和Referer字段验证来源，但请求头可伪造，安全性稍差

利用CSRF Token发送请求必须带上这个字符串给服务器来验证合法性


#### Clickjacking攻击

1、是什么

Clickjacking(点击劫持)

2、原理

是一种视觉上的欺骗手段

3、攻击方式

使用一个透明的iframe，覆盖在一个网页上，然后诱使用户在该页面上进行操作，此时用户将在不知情的情况下点击透明的iframe页面

使用一张图片覆盖在网页，遮挡网页原有位置的含义

4、如何解决

设置http响应头X-Frame-Options，值可以设置deny、sameorigin、allow-from地址，分别表示不允许iframe展示、只允许同域iframe展示、可以在指定来源的iframe中展示


#### 中间人攻击

1、是什么

中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了

2、原理

能获得双方的通信信息，并修改通信信息

3、攻击方式

客户端发送请求到服务端，请求被中间人截获，服务器向客户端发送公钥，中间人截获公钥，保留在自己手上。然后自己生成一个伪 造的公钥，发给客户端，客户端收到伪造的公钥后，生成加密hash值发给服务器，中间人获得加密hash值，用自己的私钥解密获得真秘钥。同时生成假的加密hash值，发给服务器，服务器用私钥解密获得假密钥，然后加密数据传输给客户端

4、如何解决

利用https协议可以有效防止中间人攻击