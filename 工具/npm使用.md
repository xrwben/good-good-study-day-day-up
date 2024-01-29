### npm

node包管理工具、安装node自带，文档地址：https://docs.npmjs.com/

`.npmrc`是npm的配置文件，如有有自己配置过则全局配置一般在`C:\Users\dabenli\.npmrc`

> `npm -v`

* 查看npm版本，如果有则表示安装成功可以使用

> `npm config list -l`

* 列出所有npm的默认配置，包括registry

> `npm config get registry`

* 获取当前配置的registry

> `npm config set registry https://地址`

* 设置npm源，这是永久的

> `npm install pkg --registry=https://xxxx地址`

* 安装包的时候临时指定某个源，一般是安装自己公司的内部包的时候用，或者项目里面通过`.npmrc`来配置源



### nrm（npm源管理工具）

仓库地址：https://github.com/Pana/nrm

> `npm install -g nrm`

* 使用npm全局安装nrm工具

> `nrm ls`

* 列出可选的源，如果有使用的前面则会带`*`号，会覆盖npm的设置

> `nrm add 名字 http://地址`

* 添加一个源

> `nrm use xxx`

* 使用xxx源，`nrm use cnpm`表示使用cnpm源



### cnpm (一个npm源的客户端管理工具)

仓库地址：https://www.npmjs.com/package/cnpm

> `npm install cnpm -g --registry=https://registry.npmmirror.com`

* 设置一个安装包的临时源，registry讲道理可以设置为任何源地址，使用方法为`cnpm`开头，所有参数与npm使用一致

> `cnpm config set registry https://地址`

* 设置cnpm源可以换成公司内部的



### .npmrc

定义：指定npm运行时的配置内容

优先级： 项目内 > 用户 > 全局 > 内置配置

