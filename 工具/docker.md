### docker安装

这里我们学习如何在 centos7 系统中如何安装docker

官网地址：https://docs.docker.com/engine/install/centos/
菜鸟: https://www.runoob.com/docker/centos-docker-install.html


#### 第一步

先卸载之前的版本，如果是新机器则可以忽略这一步

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```


#### 第二步

安装yum-utils包(它提供yum-config-manager实用程序)并设置存储库

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```


#### 第三步

安装docker引擎

```bash
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

安装完成后可以使用 `docker -v` 查看版本，如果安装成功则会显示版本号 

#### 第四步

启动docker

```bash
sudo systemctl start docker
```

可以设置开机自启

```bash
 sudo systemctl enable docker
```

#### 配置国内docker源

参考地址：https://www.cnblogs.com/reasonzzy/p/11127359.html

**好像阿里云才行**

```bash
1、sudo mkdir -p /etc/docker

2、sudo vi /etc/docker/daemon.json
{
  "registry-mirrors": ["https://3ywjrgyl.mirror.aliyuncs.com"]
}

3、sudo systemctl daemon-reload

4、sudo systemctl restart docker
```

#### docker常用命令

* 进入容器

```bash
docker exec -it 容器id /bin/bash
```



### 安装Jenkins

参考地址：https://juejin.cn/post/7187326853336530981?searchId=20240222152221510A080BA313D916081A#heading-3

#### 第一步 拉取镜像

```bash
docker pull jenkins/jenkins:lts
```

#### 第二步 运行容器

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
``` 

**参数说明:**
--name 定义一个容器的名字，如果没有指定，那么会自动生成一个随机数字符串当做UUID
-d 标识是让 docker 容器在后台运行
-p 9000:8080 端口映射，将宿主机9000端口映射到容器8080端口
-p 50000:50000 50000端口是基于JNLP的Jenkins代理（slave）通过TCP与 Jenkins master 进行通信的端口。

#### 第三步 配置Jenkins

1、打开 http://<ipaddress>:8080 访问 Jenkins 界面

2、会提示我们登录，会告诉我们密码在哪里，由于我们是用 docker 安装的，所以密码会被存储到容器中

```bash
docker exec -it jenkins bash
cat /var/jenkins_home/secrets/initialAdminPassword
```
`exit` 退出容器

3、安装插件



### 安装Nginx

#### 第一步 拉取镜像

```bash
docker pull nginx
```

#### 第二步 映射

将nginx关键目录映射到本机，目的是为了方便我们修改 nginx 的配置

```bash
mkdir -p /root/nginx/www /root/nginx/logs /root/nginx/conf
```