### 一、下载安装

1、下载

可以去官网下载，但是会很慢很慢特别慢，所以可以寻找一些国内的镜像网站下载，比如＝＞ http://mirror.bit.edu.cn/web/　等

2、安装
	
详细的安装步骤 ＝＞　https://www.runoob.com/w3cnote/windows10-mysql-installer.html

### 二、常用sql语句

**参考：**https://www.runoob.com/mysql/mysql-select-query.html

* 链接数据库

```
mysql -u root -p
```

* 创建数据库

```
CREATE DATABASE IF NOT EXISTS <数据库名> DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
```

* 删除数据库

```
drop database <数据库名>;
```

* 使用某个数据库

```
use <数据库名>;
```

* 创建表

```
create table if not exists 表名 (`id` int auto_increment, ***) engine=InnoDB default charset=utf8;
```

* 查看表定义

```
desc <表名>;
```

* 删除表

```
drop table <表名>;
```

* 插入

```
INSERT INTO table_name ( field1, field2,...fieldN ) VALUES ( value1, value2,...valueN );
```

* 查询

```
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M]
```

* 更新

```
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
```

* 删除

```
DELETE FROM table_name [WHERE Clause]
```

* 排序

```
SELECT field1, field2,...fieldN FROM table_name1, table_name2...
ORDER BY field1 [ASC [DESC][默认 ASC]], [field2...] [ASC [DESC][默认 ASC]]
```