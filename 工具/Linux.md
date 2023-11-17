### 使用xshell等工具常用的linux命令

* `cd ..` 退回到上一级目录

* `cd /` 回到根目录

* `ls` 查看当前目录的文件

* `ll` 当前目录文件及详情

* `cat index.js` 查看index.js文件

* `vi index.js` 编辑index.js文件

* `ip addr` 查看ip

	- i 插入

	- esc 退出i插入

	- :q 在文件未修改是退出

	- :wq 保存并退出

	- :q! 强制退出不保存

	- :w 保存

### 权限

- r: 读  w: 写  x: 执行

- chgrp ：改变文件所属群组(change group)   chown ：改变文件拥有者(change owner)   chmod ：改变文件的权限


### 目录配置

目录 | 应放置文件内容
:--: | :--
/bin | 系统有很多放置执行文件的目录，但/bin比较特殊。因为/bin放置的是在单人维护模式下还能够被操作的指令。 在/bin底下的指令可以被root与一般账号所使用，主要有：cat, chmod, chown, date, mv, mkdir, cp, bash等等常用的指令。
/boot | 这个目录主要在放置开机会使用到的文件，包括Linux核心文件以及开机选单与开机所需配置文件等等。 Linux kernel常用的档名为：vmlinuz，如果使用的是grub这个开机管理程序， 则还会存在/boot/grub/这个目录喔！
/dev | 在Linux系统上，任何装置与接口设备都是以文件的型态存在于这个目录当中的。 你只要透过存取这个目录底下的某个文件，就等于存取某个装置啰～ 比要重要的文件有/dev/null, /dev/zero, /dev/tty, /dev/lp*, /dev/hd*, /dev/sd*等等
/etc | 系统主要的配置文件几乎都放置在这个目录内，例如人员的账号密码文件、 各种服务的启始档等等。一般来说，这个目录下的各文件属性是可以让一般使用者查阅的， 但是只有root有权力修改。FHS建议不要放置可执行文件(binary)在这个目录中喔。比较重要的文件有： /etc/inittab, /etc/init.d/, /etc/modprobe.conf, /etc/X11/, /etc/fstab, /etc/sysconfig/ 等等
/home | 这是系统默认的用户家目录(home directory)。在你新增一个一般使用者账号时， 默认的用户家目录都会规范到这里来。比较重要的是，家目录有两种代号喔： ~：代表目前这个用户的家目录，而 ~dmtsai ：则代表 dmtsai 的家目录！
/lib | 系统的函式库非常的多，而/lib放置的则是在开机时会用到的函式库， 以及在/bin或/sbin底下的指令会呼叫的函式库而已。 什么是函式库呢？妳可以将他想成是『外挂』，某些指令必须要有这些『外挂』才能够顺利完成程序的执行之意。 尤其重要的是/lib/modules/这个目录， 因为该目录会放置核心相关的模块(驱动程序)喔！
/media | media是『媒体』的英文，顾名思义，这个/media底下放置的就是可移除的装置啦！ 包括软盘、光盘、DVD等等装置都暂时挂载于此。常见的档名有：/media/floppy, /media/cdrom等等。
/mnt | 如果妳想要暂时挂载某些额外的装置，一般建议妳可以放置到这个目录中。 在古早时候，这个目录的用途与/media相同啦！只是有了/media之后，这个目录就用来暂时挂载用了。
/opt | 这个是给第三方协力软件放置的目录。什么是第三方协力软件啊？ 举例来说，KDE这个桌面管理系统是一个独立的计划，不过他可以安装到Linux系统中，因此KDE的软件就建议放置到此目录下了。 另外，如果妳想要自行安装额外的软件(非原本的distribution提供的)，那么也能够将你的软件安装到这里来。 不过，以前的Linux系统中，我们还是习惯放置在/usr/local目录下呢！
/root | 系统管理员(root)的家目录。之所以放在这里，是因为如果进入单人维护模式而仅挂载根目录时， 该目录就能够拥有root的家目录，所以我们会希望root的家目录与根目录放置在同一个分割槽中。
/sbin | Linux有非常多指令是用来设定系统环境的，这些指令只有root才能够利用来『设定』系统，其他用户最多只能用来『查询』而已。 放在/sbin底下的为开机过程中所需要的，里面包括了开机、修复、还原系统所需要的指令。 至于某些服务器软件程序，一般则放置到/usr/sbin/当中。至于本机自行安装的软件所产生的系统执行文件(system binary)， 则放置到/usr/local/sbin/当中了。常见的指令包括：fdisk, fsck, ifconfig, init, mkfs等等。
/srv | srv可以视为『service』的缩写，是一些网络服务启动之后，这些服务所需要取用的数据目录。 常见的服务例如WWW, FTP等等。举例来说，WWW服务器需要的网页数据就可以放置在/srv/www/里面。
/tmp | 这是让一般使用者或者是正在执行的程序暂时放置文件的地方。 这个目录是任何人都能够存取的，所以你需要定期的清理一下。当然，重要数据不可放置在此目录啊！ 因为FHS甚至建议在开机时，应该要将/tmp下的数据都删除唷！


### yum和apt-get的区别

#### rpm包和deb包是两种Linux系统下最常见的安装包格式

- rpm包主要应用在RedHat系列包括 Fedora、CentOS等发行版的Linux系统上

- deb包主要应用于Debian系列包括现在比较流行的Ubuntu等发行版上

yum可以用于运作rpm包，例如在Fedora系统上对某个软件的管理：

	安装：yum install <package_name>

	卸载：yum remove <package_name>

	更新：yum update <package_name>

apt-get可以用于运作deb包，例如在Ubuntu系统上对某个软件的管理：

	安装：apt-get install <package_name>

	卸载：apt-get remove <package_name>

	更新：apt-get update <package_name>