## 常用命令

* start nginx 启动
* nginx -s quit 关闭
* nginx -s reload 重新加载
* nginx -t 检查配置是否语法错误

## locatin匹配规则 https://segmentfault.com/a/1190000009237425

> 语法：location [ = | ~ | ~* | ^~ ] uri { ... }

- **匹配优先级： =, ^~, ~/~\*, 不带符号**

- 如果有“=”修饰符，精确匹配某个路径，停止匹配

- 如果有这个“^\~”修饰符，停止匹配

- 如果无“^\~”， 最终使用正则匹配到的路径，正则顺序匹配到第一个后就停止

- 字符串匹配，如果有正则也匹配到则使用正则，如果正则匹配不到，使用字符串前缀匹配最长的

### 常用配置指令

- **`alias` —— 别名配置，在匹配到location配置的url路径后，指向alias配置的路径**

如：
```
location /test/ {
    alias /usr/local/;
}
```
请求/test/1.jpg（省略了协议和域名），将会返回文件/usr/local/1.jpg


如果使用了正则，则alias配置也要引用正则捕获的值，如：
```
location ~ /dist/vmaker/(.*) {
	alias /guojiang/xg-tpl/dist/mobile/html/$1;
}
```
请求/dist/vmaker/2020/2/modCommemorationDay.html，返回/guojiang/xg-tpl/dist/mobile/html/2020/2/modCommemorationDay.html

- **`root` —— 根路径配置，匹配到location配置的URL路径后，指向root配置的路径，并把请求路径附加到其后**

如：
```
location /test/ {
    root /usr/local/;
}
```
请求/test/1.jpg（省略了协议和域名），将会返回文件/usr/local/test/1.jpg

>> **alias与root区别：root真实路径是root指定的值加上location指定的值，alias真实路径是alias指定的值替换，不包含location指定的值了**

- **`proxy_pass` —— 方向代理配置，用于代理请求**

如：
```
location /test/ {
   proxy_pass http://127.0.0.1:8080/;
}
```
请求/test/1.jpg，将会被nginx转发请求到http://127.0.0.1:8080/1.jpg（未附加/test/路径，如果 proxy_pass http://127.0.0.1:8080;则附加）



---

## 文件及目录匹配判断

* -f和!-f用来判断是否存在文件

* -d和!-d用来判断是否存在目录

* -e和!-e用来判断是否存在文件或目录

* -x和!-x用来判断文件是否可执行

---

## 正则表达式匹配

* ==：等值比较

* \~：与指定正则表达式模式匹配时返回“真”，区分大小写

* \~\*：与指定正则表达式模式匹配时返回“真”，不区分大小写

* !\~：与指定正则表达式模式不匹配时返回“真”，区分大小写

* !\~\*：与指定正则表达式模式不匹配时返回“真”，不区分大小写

---

## rewrite语法

> `rewrite regex replacement [flag];`

* last – 基本上都用这个Flag，继续查找匹配改变后URI的新location

* break – 中止Rewirte，不在继续匹配

* redirect – 返回临时重定向的HTTP状态302

* permanent – 返回永久重定向的HTTP状态301

---

## if语句判断

> nginx并未提供逻辑运算，所以我们这时候只有通过**设置变量的值**来变相的实现逻辑运算了

需求：
```
if (!-e $request_uri && !-d $request_uri) {
    return 404;
}
```
实现：
```
set $flag  0;
if (!-e $request_uri) {
    set set $flag "${flag}1";
}
if (!-d $request_uri) {
    set $flag "${flag}1";
}
if ($flag = '011') {
    return 404;
}
```

---

## 内置变量 https://tyloafer.github.io/posts/62480/

- $args： 这个变量等于请求行中的参数，同$query_string

- $query_string： 与$args一样

- $content_length： 请求头中的Content-length字段

- $content_type： 等同与请求头部的Content_Type的值

- $document_root： 等同于当前请求的root指令指定的值

- $host： 请求主机头字段，否则为服务器名称

- $http_user_agent： 客户端agent信息

- $http_cookie： 客户端cookie信息

- $limit_rate： 允许限制的连接速率

- $request_method： 等同于request的method，通常是“GET”或“POST”

- $server_protocol： 请求使用的协议，通常是HTTP/1.0或HTTP/1.1

- $server_addr： 服务器地址，在完成一次系统调用后可以确定这个值

- $server_port： 请求到达的服务器的端口号

- $server_name： 服务器名称

- $scheme： HTTP方法（如http，https）

- $request_filename： 当前请求的文件的路径名，由root或alias和URIrequest组合而成

- $request_body_file

- $remote_user： 等同于用户名，由ngx_http_auth_basic_module认证

- $remote_port： 客户端port

- $remote_addr： 客户端ip

- $request_uri： 包含请求参数的原始URI，不包含主机名，如：“/foo/bar.php?arg=baz”

- $uri： 不带请求参数的当前URI，\$uri不包含主机名，如“/foo/bar.html”

- $document_uri： 与$uri一样

---

## 自定义变量

> `set $name "liben"`  注：也可以写把变量写成`${path}` 

```
location ~ /self-variable(/)(.*)$ {     
    set $path 'tyloafer';                      
    return 200 "path = $path , 1 = $1 , 2 = $2";
}
```
> GET http://test.tyloafer.cn/self-variable/haha  =>   path = tyloafer , 1 = / , 2 = haha

```
location ~ /self-variable(/)(.*)$ {            
    set $path 'tyloafer';
    if ($request_uri ~ 'haha') {
        return 200 $1;
    } 
}
```
> 这时候在进行第一次location正则匹配是产生的\$1，在进行第二次 $request_uri ~ 'haha' 正则匹配的时候会被覆盖，所以这时候，返回的是空白的，并不是上面的 /