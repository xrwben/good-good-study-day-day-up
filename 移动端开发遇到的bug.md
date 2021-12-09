1、ios不支持“2020-01-01”这种日期格式 用正则把-替换成/

2、ios全局滑动没有停止，局部滑动不能选中

3、当屏幕缩小，而字体已经不能再缩小时，布局错乱 把字体切成图片(缺陷，对于要变换的字体要切多套图)

4、v-for没有设置key或者key值为index引发的dom重复利用，修改行内样式style导致的样式不一致 width:50%

5、swiper在loop模式下会复制第一个和最后一个，但是复制只会复制页面不会复制点击事件，解决方法就是在swiper的回调事件函数中去处理

6、clipboard在移动端复制失败，发现是要复制的标签元素加了readonly属性或者hidden等，于是用高级函数用法，Android没问题后发现ios特别恶心，iphone xr一直失败，然后无意中发现要点击两次才能成功，最后发现是和fastClick冲突，解决办法就是点击的目标元素添加类needsclick来单独解除点击延迟事件

7、ios某些型号(xr)输入框textarea/input必须重压或长按才能唤起软键盘，是fastclick.js 引起的冲突，方法一：输入框事假@click="focus"，focus(e) { e.target.focus() }, 方法二：改fastClick.js源码中的focus方法

8、video属性定义了宽高，但是播放的时候video尺寸变化了，而且poster图片尺寸不适配，处理方法是给video样式加上 object-fit:fill; 属性，但这个属性不支持IE

9、table+border-radius无效，原因是设置了 border-collapse:collapse 样式，方法是collapse改为separate + border-spacing:0，但是这样table边框要处理一下

10、flex与ellipsis共存在一个元素上失效，解决方法为嵌套一层元素，这个方法简直垃圾，并没有解决问题。（这个bug太傻比了）

11、iphone某些机型(iphone6)使用flex布局align-item属性让元素上下居中时失效，解决方法是给居中元素一个padding值，让其上下撑开到父元素高度

12、ios某个机型(iphone6)使用flex布局自动计算flex:1会显示为大小0，让子元素无法滑动，解决办法是不使用flex，给个定高或百分比计算高度

13、在less中使用calc(100% - 200px)语法时无法解析，解决方法是加个calc(~"100% - 200px")，但是如果有变量时就不能这么写，可以先声明个变量 @diff: 215/@bf，然后height: calc(~"100% - @{diff}")这样写就能够解析

14、H5跳转给了一个同样的url参数，在安卓端、浏览器上均能够正常解析，iOS端解析异常，原因可能链接里有%等特殊符号，解决方法就是用decondeRUIConponet()函数把url编码解码

15、forEach()函数中的回调是异步，要同步改为for循环

16、在使用flex布局的时候，可能遇到父元素flex为1，同时子元素也设置了flex为1并且长度超出父级，这是可能会出现压缩父元素左右两边的元素现象，解决方法是设置子元素width:0就可以了，注意：火狐浏览器要加个min-width:0兼容

17、一个盒子如果没有上补白(padding-top)和上边框(border-top)，那么这个盒子的上边距会和其内部文档流中的第一个子元素的上边距重叠，解决方法: 1. 给父元素增加属性：overflow:hidden 2. 给父元素增加边框，如果不需要边框则加一个透明边框，不会影响到样式 3. 可以用父元素的padding-top来代替子元素的margin-top 4. 给父元素添加属性 position：absolute

18、父元素设置属性max-height，子元素设置height:100无法生效，原因是max-height是动态计算的，解决方法：在父元素和子元素再加一层div,将原有的父元素设置为flex布局，而新加的这层div设置flex:1，这样子元素就能生效不会超出高度

19、app内嵌h5页面请求http协议图片资源，oppo某些型号手机不显示图片资源，解决方法：给页面head标签里加<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">，自动将网页上所有加载外部资源的 HTTP 链接换成 HTTPS 协议

20、某些电脑页面个别字符乱码显示“口”，原因是从word文档中复制过来字符编码有问题，解决方法：有问题字符手动敲一遍

21、部分Android机(vivo某型号)使用line-height可能文字上下不能垂直居中，具体原因可能跟文字渲染有关，hack方法：
```
.name {
    width: 200/@bf;
    height: 60/@bf;
    color: #fff;
    background: #ff2248;
    border-radius: 20/@bf;
    font-size: 26/@bf;
    text-align: center;
    margin: 0 10/@bf;
    padding: 5/@bf 5/@bf 5/@bf 10/@bf;
    display: table;
    & > p {
        background: green;
        line-height: normal;
        display: table-cell;
        vertical-align: middle;
        &::after{
            content: ' ';
            display: inline-block;
            width: 0;
            height: 100%;
            vertical-align: middle;
            margin-top: 1px;
          }
    }
}
```

22、当我们使用flex布局，子元素设置了flex:1 后再设置width会无效，因为flex:1 是简写 flex-grow、flex-shrink、flex-basis，如果要设置宽度需要通过flex-basis指定宽度

23、ios11.1.2使用es6'...'扩展运算符报错SyntaxError: Unexpected token '…'. Expected a property name，解决方法就是使用es5语法

24、webpack打包然后访问出现 'Provisional headers are shown' 提示，可能是地址栏https协议导致的，切换到http即可

25、微信扫码链接不自动跳转，先显示链接地址，点击才能跳转，解决方法就是链接需要加上协议