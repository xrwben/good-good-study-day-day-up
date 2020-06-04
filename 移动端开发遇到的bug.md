1、ios不支持“2020-01-01”这种日期格式 用正则把-替换成/

2、ios全局滑动没有停止，局部滑动不能选中

3、当屏幕缩小，而字体已经不能再缩小时，布局错乱 把字体切成图片(缺陷，对于要变换的字体要切多套图)

4、v-for没有设置key引发的dom重复利用，修改行内样式style导致的样式不一致 width:50%

5、swiper在loop模式下会复制第一个和最后一个，但是复制只会复制页面不会复制点击事件，解决方法就是在swiper的回调事件函数中去处理

6、clipboard在移动端复制失败，发现是要复制的标签元素加了readonly属性或者hidden等，于是用高级函数用法，Android没问题后发现ios特别恶心，iphone xr一直失败，然后无意中发现要点击两次才能成功，最后发现是和fastClick冲突，解决办法就是点击的目标元素添加类needsclick来单独解除点击延迟事件

7、ios某些型号输入框textarea/input必须重压或长按才能唤起软键盘，是fastclick.js 引起的冲突，方法一：输入框事假@click="focus"，focus(e) { e.target.focus() }, 方法二：改fastClick.js源码中的focus方法

8、video属性定义了宽高，但是播放的时候video尺寸变化了，处理方法是给video样式加上 object-fit:fill; 属性，但这个属性不支持IE

9、table+border-radius无效，原因是设置了 border-collapse:collapse 样式，方法是collapse改为separate + border-spacing:0，但是这样table边框要处理一下

10、flex与ellipsis共存在一个元素上失效，解决方法为嵌套一层元素，这个方法简直垃圾，并没有解决问题。（这个bug太傻比了）