### 使用xshell等工具常用的linux命令

* `cd ..` 退回到上一级目录

* `cd /` 回到根目录

* `ls` 查看当前目录的文件

* `ll` 当前目录文件及详情

* `cat index.js` 查看index.js文件

* `vi index.js` 编辑index.js文件

	- i 插入

	- esc 退出i插入

	- :q 在文件未修改是退出

	- :wq 保存并退出

	- :q! 强制退出不保存

	- :w 保存

## 权限

- r: 读  w: 写  x: 执行

- chgrp ：改变文件所属群组(change group)   chown ：改变文件拥有者(change owner)   chmod ：改变文件的权限


### 目录配置

目录 | 应放置文件内容
:--: | :--
/bin | 系统有很多放置执行文件的目录，但/bin比较特殊。因为/bin放置的是在单人维护模式下还能够被操作的指令。 在/bin底下的指令可以被root与一般账号所使用，主要有：cat, chmod, chown, date, mv, mkdir, cp, bash等等常用的指令。
/boot | 这个目录主要在放置开机会使用到的文件，包括Linux核心文件以及开机选单与开机所需配置文件等等。 Linux kernel常用的档名为：vmlinuz，如果使用的是grub这个开机管理程序， 则还会存在/boot/grub/这个目录喔！
/dev | 在Linux系统上，任何装置与接口设备都是以文件的型态存在于这个目录当中的。 你只要透过存取这个目录底下的某个文件，就等于存取某个装置啰～ 比要重要的文件有/dev/null, /dev/zero, /dev/tty, /dev/lp*, /dev/hd*, /dev/sd*等等
/etc | 系统主要的配置文件几乎都放置在这个目录内，例如人员的账号密码文件、 各种服务的启始档等等。一般来说，这个目录下的各文件属性是可以让一般使用者查阅的， 但是只有root有权力修改。FHS建议不要放置可执行文件(binary)在这个目录中喔。比较重要的文件有： /etc/inittab, /etc/init.d/, /etc/modprobe.conf, /etc/X11/, /etc/fstab, /etc/sysconfig/ 等等