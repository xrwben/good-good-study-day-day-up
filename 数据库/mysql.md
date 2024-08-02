### MySQL学习

链接：https://www.runoob.com/mysql/mysql-tutorial.html


#### 安装

下载地址：https://dev.mysql.com/downloads/mysql/

window安装：https://www.runoob.com/w3cnote/windows10-mysql-installer.html


#### 常用命令

** 注意：数据库的操作命令要加分号`;` **

> `mysql -u 用户名 -p`

* 连接数据库，回车输入密码，成功后会出现 `mysql>` 命令提示窗口

> `exit` 或 `quit`

* 退出连接

> `show databases;`

* 列出所有可用的数据库

> `use 数据库名;`

* 选择要使用的数据库，后面命令全部作用于使用的数据库

> `show tables;`

* 列出所选数据库中的所有表

> ```CREATE DATABASE [IF NOT EXISTS] 数据库名
  [CHARACTER SET utf8mb4]
  [COLLATE utf8mb4_general_ci];```

* 创建数据库

> `DROP DATABASE [IF EXISTS] 数据库名;`

* 删除库

> ```CREATE TABLE table_name (
   column_name datatype [AUTO_INCREMENT] [PRIMARY KEY] [NOT NULL],
   column_name datatype,
    ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8;```

* 表的创建

> `DROP TABLE [IF EXISTS] table_name;`

* 删除表

> `show columns from 表名;`

* 显示数据表的属性，属性类型，主键信息 ，是否为 NULL，默认值等其他信息

> `INSERT INTO users (username, email, birthdate, is_active) VALUES ('test', 'test@runoob.com', '1990-01-01', true);`

* 插入数据，如果插入全部列名可以省略