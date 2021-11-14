### 星光项目发测试jenkins配置

```
# 注释代码在必要时候打开方便调试
echo '===================================';
# ifconfig;
echo '星光测试环境连接成功';
echo '===================================';
echo '进入测试编译中转目录：';
cd /var/www/jenkins/xgTest/xingguang-webpack;
echo '同步脚手架：';
eval `ssh-agent`;
ssh-add ~/.ssh/fegitlab_id_rsa;
ssh-add -l;
git remote -v;
echo '当前目录：';
pwd;
echo '拉取代码';
git pull;
git checkout master;
cd xingguang;
echo '同步测试分支代码：';
# ssh-add -l;
# git remote -v;
echo '当前目录：';
pwd;
echo '强制拉取代码覆盖本地';
git fetch origin release/test;
git reset --hard release/test;
git pull;
cd ../;
echo '===================================';
echo '编译构建：'
yarn;
yarn pc_dll;
yarn pc_vendor;
yarn pc_deploy;
yarn dll;
yarn vendor-report;
yarn deploy;
echo '===================================';
echo '部署构建文件到指定文件夹：'
cd xingguang;
\cp -rf static_guojiang_tv/pc/v4/** /var/www/static_guojiang_tv/pc/v4/;
\cp -rf static_guojiang_tv/mobile/v2/** /var/www/static_guojiang_tv/mobile/v2/;
\cp -rf html/pc/dist/** /var/www/videochat/web/html/pc/dist/;
\cp -rf html/mobile/dist/** /var/www/videochat/web/html/mobile/dist/;
echo '===================================';
echo '删除xgTest源码的css和js部分以及html的src，防止git pull时发生冲突：';
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/js/;
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/css/;
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/js/;
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/css/;
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/html/pc/src/;
rm -rf /var/www/jenkins/xgTest/xingguang-webpack/xingguang/html/mobile/src;
echo '连接完毕，退出ssh，防止连接数过多：';
exit;
```

### 星光项目发线上配置

```
echo '===================================';
echo '星光测试环境连接成功';
# ifconfig;
echo '===================================';
echo '进入发布线上编译中转目录：';
cd /var/www/jenkins/xgTrunk/xingguang-webpack;
echo '同步脚手架：';
eval `ssh-agent`;
ssh-add ~/.ssh/fegitlab_id_rsa;
git remote -v;
git pull;
git checkout master;
echo '===================================';
cd xingguang;
echo '同步发布分支代码：';
git remote -v;
echo '当前目录：';
pwd;
echo '拉取代码：';
git pull;
git checkout release/prop;
git fetch origin release/prop;
git reset --hard release/prop;
cd ../;
echo '===================================';
echo '编译构建：'
yarn;
if  [ "$type" == "pc" ];then
yarn pc_dll;
yarn pc_vendor-report;
yarn pc_deploy;
elif  [ "$type" == "mobile" ];then
yarn dll;
yarn vendor-report;
yarn deploy;
    else
yarn pc_dll;
yarn pc_vendor-report;
yarn pc_deploy;
yarn dll;
yarn vendor-report;
yarn deploy;
fi
echo '===================================';
echo '开始部署构建文件到指定文件夹：'
echo '更新trunk svn：';
cd /var/www/jenkins/xgTrunkSvn/html;
svn up;
cd /var/www/jenkins/xgTrunkSvn/static/mobile/v2/;
svn up;
cd /var/www/jenkins/xgTrunkSvn/static/pc/v4/;
svn up;
echo '进入代码库准备移动文件到trunk svn：'
cd /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang;
if  [ "$type" == "pc" ];then
\cp -rf static_guojiang_tv/pc/v4/** /var/www/jenkins/xgTrunkSvn/static/pc/v4/;
\cp -rf html/pc/dist/** /var/www/jenkins/xgTrunkSvn/html/pc/dist/;
elif  [ "$type" == "mobile" ];then
\cp -rf static_guojiang_tv/mobile/v2/** /var/www/jenkins/xgTrunkSvn/static/mobile/v2/;
\cp -rf html/mobile/dist/** /var/www/jenkins/xgTrunkSvn/html/mobile/dist/;
    else
\cp -rf static_guojiang_tv/pc/v4/** /var/www/jenkins/xgTrunkSvn/static/pc/v4/;
\cp -rf html/pc/dist/** /var/www/jenkins/xgTrunkSvn/html/pc/dist/;
\cp -rf static_guojiang_tv/mobile/v2/** /var/www/jenkins/xgTrunkSvn/static/mobile/v2/;
\cp -rf html/mobile/dist/** /var/www/jenkins/xgTrunkSvn/html/mobile/dist/;
fi
echo '提交trunk svn：';
cd /var/www/jenkins/xgTrunkSvn;
./svn.sh "$deployMsg";
echo '提交成功，请到admin发布平台更新videochat和static，然后发布到线上。';
echo '===================================';
echo '删除temTrunk源码的css和js部分以及html的src，防止git pull时发生冲突：';
if  [ "$type" == "pc" ];then
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/js/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/css/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/html/pc/src/;
elif  [ "$type" == "mobile" ];then
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/js/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/css/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/html/mobile/src;
    else
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/js/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/pc/v4/css/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/html/pc/src/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/js/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/static_guojiang_tv/src/mobile/v2/css/;
rm -rf /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang/html/mobile/src;
fi
echo '===================================';
cd /var/www/jenkins/xgTrunk/xingguang-webpack/xingguang;
eval `ssh-agent`;
ssh-add ~/.ssh/fegitlab_id_rsa;
echo '开始合并发布分支到master:';
echo '切换分支到master：';
git checkout master;
echo '拉取master最新代码：';
git pull;
git fetch origin master;
git reset --hard master;
git branch -a;
echo '合并分支：';
git merge release/prop;
echo '目前git状态：';
git status;
echo '发布到远程master分支';
git push origin master;
git status;
git branch -a;
echo '删除本地发布分支：';
git branch -d release/prop;
git branch -a;
echo '删除远程发布分支：';
git push origin --delete release/prop;
git branch -a;
echo '下面开始给远程master打tag';
git tag -a v-new-$BUILD_NUMBER -m "$deployMsg";
echo '查看所有标签：';
git tag;
echo '推送标签到远程仓库：';
git push origin --tags;
echo '===================================';
echo '连接完毕，退出ssh，防止连接数过多：';
exit;
```