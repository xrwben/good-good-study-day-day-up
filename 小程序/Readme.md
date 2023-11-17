### 一、自定义导航栏

#### 背景

&emsp;为何要自定义顶部导航栏，默认不是挺好用的吗，说到底还不是狗产品要搞些花里胡哨的东西，自定义导航栏有哪些好处呢：

* Android、IOS页面标题可以与设计图保持一致，不然设计验收时又要逼逼赖赖
* 左边返回事件可以监听，icon可以定制化
* 可以做一些动效或者不同场景变化

总之自定义导航栏虽然复杂一丢丢，但是好处还是多多，可以实现一些复杂的需求。

那么接下来我们就实现一个腾讯理财通首页的类似的效果，先上图：

![腾讯理财通小程序首页.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c73d04288f71470391ac17b97959e39f~tplv-k3u1fbpfcp-zoom-1.image)

浅析一番：我们观察发现这个自定义导航栏还挺复杂的，第一这个导航是个粘性定位，第二标题不动但有个透明度效果，第三搜索框有个随着页面滑动的缩放动效。

#### 如何实现

这里我们需要注意几个关键点：

1、不同的机型右侧胶囊位置大小区别，特别是刘海屏出现后，这种如何处理？

2、导航栏随着滑动定位在顶部怎么实现？

3、随着页面滑动，搜索框缩放定位动效如何实现？

下面我们就来处理这几个主要问题，先上自己实现的效果图：

![GIF 自定义导航栏.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07c726234c184a04a2ffb4b3f5f8f3b1~tplv-k3u1fbpfcp-zoom-1.image)

压缩的比较狠，GIF图看起来有点儿模糊了，但问题不大。想看运行Demo可以点击【[这里](https://developers.weixin.qq.com/s/YrrsbomW76Kv)】查看

##### 第1点：处理胶囊和导航栏高度适应不同机型

&emsp;**导航栏高度=状态栏高度+右上角胶囊按钮的高度+胶囊与状态栏间隙距离x2**，微信开放社区和网上有许多类似[微信小程序自定义导航栏组件(完美适配所有手机)](https://developers.weixin.qq.com/community/develop/article/doc/00068aec7941f8f57509794be54413)等文章的介绍，基本都是通过[wx.getMenuButtonBoundingClientRect()](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)和[wx.getSystemInfo()](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html)这两个方法来实现，`wx.getMenuButtonBoundingClientRect()`方法获取菜单按钮（右上角胶囊按钮）的布局位置信息，坐标信息以屏幕左上角为原点，`wx.getSystemInfo()`方法是获取系统信息，包括屏幕信息、机型等等，其中`statusBarHeight`属性表示状态栏的高度。

&emsp;我们想要适配任何机型，其实只是要让自定义的导航栏不要遮住状态栏即可，而且设计图一般都是盯着胶囊菜单的上沿开始设计的，胶囊下边不管还有没有其它东西，我们只需要按设计图给个padding-bottom距离就好，根本无需用胶囊与状态栏间隙距离，那么我们只需要通过给导航栏上下内边距就完全可以适配，根据我们的实现大概就是`导航栏 = padding-top + 内容 + padding-bottom`即可，如下图：

![高度由上下内边距撑开](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12be873d09c6436e8797ef120ddb797a~tplv-k3u1fbpfcp-zoom-1.image)

导航栏高度由上下内边距撑开，这个上内边距就是通过[wx.getMenuButtonBoundingClientRect()](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)方法来获取，该方法的返回值同JavaScript中的`getBoundingClientRect()`方法类似，所以我们的padding-top值就为`getMenuButtonBoundingClientRect()`方法返回的top值，padding-bottom值则根据设计图来即可，基本上就可以适配所有机型了，不管是开启wifi或者热点时我们的布局都不会乱，因为根本就无需关心状态栏的高度，下面图是不同的机型返回的不同top值。

```js
globalData: {
  menuRect: null,
  systemInfo: null
},
// 根据机型动态设置导航栏高度
setNavHeight() {
  // 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
  const MenuRect = wx.getMenuButtonBoundingClientRect()
  wx.getSystemInfo({
    success: (res) => {
      this.globalData.menuRect = MenuRect
      this.globalData.systemInfo = res
    }
  })
}
```

![不同机型返回不同top值](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7619efe69620444fa2da7f92e91d6147~tplv-k3u1fbpfcp-zoom-1.image)

这里我们需要注意的是`getMenuButtonBoundingClientRect()`方法返回值得单位都是px，而我们写样式是rpx，该怎么换算我们后面会讲到。

##### 第2点：上下滑动导航栏粘性定位实现

&emsp;页面往上滑动导航栏固定在顶部，这个功能我们十分常见，几乎每个APP都可见，之前H5也做个类似的功能。如何实现的呢？最初的想法是通过固定定位`fixed`来实现，往上滑动到一定距离就定位在顶部，但是通过编码运行发现了几个问题。

* 问题一：固定定位会导致但航栏脱离文档流，滚动距离发生变化产生抖动，从而不好实现搜索框的缩放效果。
* 问题二：如果固定在顶部，那导航栏部分下拉刷新功能则会无法实现。

所以固定定位这种方案直接排除了，从而采用`sticky`粘性定位。

&emsp;菜鸡看了理财通首页这个自定义导航栏肯定会认为，这个简单直接一个`sticky`不就搞定了，你还需要逼逼赖赖这么半天，不是有手就行？我冷哼一笑，只能说你还太年轻了小伙子。而一个高手通过仔细看上面效果图就会发现其实这不是单纯的粘性定位，你不仅要让导航栏定位在顶部，导航栏里面的标题和搜索框也需要定位在顶部，这个看起来简单，其实雀氏简单，因为这就是个`双粘性定位布局`，不过你得特别注意`sticky`用法，可能你会发现有时候定位不生效，具体使用规则点击[这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)查看。

&emsp;那么什么是`双粘性定位`布局？我们可以看看张鑫旭前辈写的这篇文章—**[CSS实现滚动高度自动变小的粘滞效果](https://www.zhangxinxu.com/wordpress/2022/04/css-sticky-size-change/)**，基本原理就是导航栏外部需要粘性定位，内部显示的元素也需要粘性定位。

**接下来分析下上面效果该如何具体实现**

![分析图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4931e0a9286434991059eacf05ec972~tplv-k3u1fbpfcp-zoom-1.image)

通过上图分析我们要处理的是两部分，一是标题粘性定位与右侧胶囊平齐，二是搜索框跟随导航上移然后粘性定位到与右侧胶囊平齐。

下面是布局和获取距离的部分代码：

```html
<view class="header-search" style="padding-top:{{navPaddingTop}}px; position: sticky; top: {{-searchStickyTop}}px;">
  <view class="pull-loading" wx:if="{{isPullDowning}}">聚沙成塔</view>
  <view class="logo" style="position: sticky; top: {{navPaddingTop}}px; opacity: {{(searchStickyTop - scrollTop) / searchStickyTop}};">
  <!-- <view class="logo" style="transform: translate3d(0, {{scrollTop}}px, 0); opacity: {{(searchStickyTop - scrollTop) / searchStickyTop}};"> -->
    <image class='pic' src='/image/logo.png'></image>
    <text class="title">{{ title }}</text>
  </view>
  <view class="search-con" style="padding-right: {{searchPaddingRight}}rpx;">
    <view class="search" bindtap="goSearchPage">
      <image class="icon" src="/image/search.png"></image>
      <input class="input"
        type="text"
        value="{{searchkey}}"
        disabled="true"
        placeholder="输入关键词搜索{{scrollTop}}{{searchStickyTop}}"
        placeholder-class="placeholder"
        confirm-type="search"
        bindinput="input"
        bindconfirm="searchEvent"
      />
    </view>
  </view>
</view>
```
```js
attached () {
  console.log(app.globalData)
  this.setData({
    globalData: app.globalData,
    navPaddingTop: app.globalData.menuRect.top
  })
  // 获取搜索框的距离
  wx.createSelectorQuery().in(this).select('.search-con').boundingClientRect().exec(res => {
    const _offsetMenuBtn = res[0].top - this.data.navPaddingTop
    console.log(res, _offsetMenuBtn)
    app.globalData.searchOffset = _offsetMenuBtn
    this.setData({
      searchStickyTop: _offsetMenuBtn
    })
    this.triggerEvent('getStickyTop', _offsetMenuBtn)
  })
}
```

分析：`navPaddingTop`就是我们在app.js中写在全局的右侧胶囊的top值，`searchStickyTop`为我们计算出的需要导航栏定位的top值。

##### 第3点：标题透明渐变和搜索框缩放效果

&emsp;通过观察发现随着页面向上滑动到搜索框定位的距离，这段距离我们知道就是`searchStickyTop`值，我们的动效随着滚动距离srcollTop在这个值内变化即可。

标题透明渐变主要代码：
```html
<view class="logo" style="position: sticky; top: {{navPaddingTop}}px; opacity: {{(searchStickyTop - scrollTop) / searchStickyTop}};">
  <image class='pic' src='/image/logo.png'></image>
  <text class="title">{{ title }}</text>
</view>
```

搜索框缩放主要代码：
```js
observers: {
  "marginTop": function(marginTop) {
    if (marginTop >= this.data.searchStickyTop) {
      marginTop = this.data.searchStickyTop
    } else if (marginTop <= 0) {
      marginTop = 0
    }
    const _paddingRight = marginTop > 0 ? (marginTop - this.data.searchStickyTop + app.globalData.systemInfo.screenWidth - app.globalData.menuRect.left + 16) * 2 : 32
    console.log(_paddingRight)
    this.setData({
      scrollTop: marginTop,
      searchPaddingRight: _paddingRight
    })
  }
}
```

解析：标题透明度值为0-1，当我们滑到顶就为消失，所以我们根据公式`(searchStickyTop - scrollTop) / searchStickyTop`来计算即可，scrollTop值为页面滚动的距离，这个应该不难理解。
关键是搜索框的缩放，我们代码是根据左右padding来控制，所以当我们上滑时需要控制的就只有右边距`searchPaddingRight`值，需要**注意**下面这行关键代码

> const _paddingRight = marginTop > 0 ? (marginTop - this.data.searchStickyTop + app.globalData.systemInfo.screenWidth - app.globalData.menuRect.left + 16) \* 2 : 32

这段代码是什么意思呢？首先`marginTop`是我们页面滚动距离，我们已经处理好了临界值了，所以当marginTop小于等于0时表示页面没有滚动，当marginTop值大于0时才需要计算搜索框右内边距，而这个内边距不是一个固定距离，会根据我们的不同机型而不一致，因为我们们缩小时搜索框和胶囊left值要保持一定距离，所以要动态计算，这里应该理解为何要这么计算了吧，关于乘以2，是因为这个值是我根据设计图兑换的rpx与px比，你也可以根据你的设计图宽度计算或直接使用px也行。

**整个自定义导航栏滑动渐变效果就这么出来了，具体可以拉代码细看**

### 二、自定义底部tabBar

&emsp;某些时候我们产品或者设计师会对tabBar要做一些定制化需求，比如常见的样式定制，而我之前做的腾讯学堂的小程序就有个很奇怪的需求，点击某tab显示一个上拉弹窗，我简直人麻了。

通常来说自定义tabBar大概有两种方式：

1、 官方约定的[自定义tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)

2、纯自定义tabBar组件

下面我就只说说官方约定的自定义tabBar，先上图：

![自定义tabbar.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3699ee4057384d3a826353a6b2dc8d9a~tplv-k3u1fbpfcp-zoom-1.image)

#### 如何实现

第一步：还是需要到app.json文件下配置tabBar对象，我们需要把`custom`字段设置为true，这样就算开启了自定义，其它必填项也要补充完整。

第二步：在根目录下新建一个**custom-tab-bar**的文件夹，注意的是必需规定这个名称，不能用其它自定义的。

第三步：根据设计图完成即可

#### 遇到的问题

&emsp;根据文档我们十分简单的就完成了自定义tabBar，一些跳转功能我们通过`wx.switchTab()`方法就可以模拟出来，但是如果第一次开发可能遇到下面几个问题：

1、这个自定义tabbar组件必须放在根目录的custom-tab-bar 文件夹下，这样才能被识别

2、兼容性，基础库版本需要2.5.0，所以我们要在app.json配置同样的list

3、选中的样式对不上问题，解决方法是在需要显示的tab页通过getTabBar()获取自定义组件然后设置更改currentTab值，如下面代码：

```js
/**
 * 生命周期函数--监听页面显示
 */
onShow() {
  if (typeof this.getTabBar === 'function') {
    this.getTabBar().setData({
      currentTab: 'home'
    })
  }
}
```

4、遇到iphoneX等下面有黑色横杠的机型时会被遮住，如下图：

![自定义tabbar被遮住.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/297a0e64d105463cb3b30ca6fd834ef8~tplv-k3u1fbpfcp-zoom-1.image)

这种情况我们只需要给个安全距离样式即可：

```css
padding-bottom: constant(safe-area-inset-bottom);
padding-bottom: env(safe-area-inset-bottom);
```

5、弹窗无法覆盖tabBar，需要把弹窗z-index设为99999即可

### 三、富文本组件解析出错

&emsp;当我们使用一些第三方库时，可能某些富文本元素使用`rich-text`组件解析不出来，就比如之前如果要显示的文本最后有`<`符号就不会解析，具体原因也不清楚，反正最后的处理方案就是使用微信开发社区推荐这个组件 — [mp-html](https://jin-yufeng.gitee.io/mp-html/#/overview/quickstart)，具体使用方式可以查看改文档。

### 四、小程序事件传参

&emsp;如果你使用的是第三方框架开发小程序，那么事件传参跟JavaScript没有区别，如果你是使用原生小程序开发，那么直接在绑定的事件函数名括号里写可能就会有问题，那么原生小程序我们如何传参呢？

![事件传参](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1638729f2494556961690a0b841b3dd~tplv-k3u1fbpfcp-zoom-1.image)

如图我们只需把要传递的参数通过data-xxx的方式绑定在节点上，然后通过`event.currentTarget.dataset.xxx`方式即可获取。

### 五、组件通信的方式

 通常来说分三种情况，可参考文档[组件间通信方式](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)：

##### 第一种：父组件给子组件传值

我们只需要通过WXML数据绑定的方式即可，与Vue框架类似

```html
<nav-bar isPullDowning="{{isPullDowning}}" marginTop="{{marginTop}}" bindgetStickyTop="getStickyTop"></nav-bar>
```

##### 第二种：子组件给父组件传值

这种情况我们需要绑定事件来完成，看上面代码，我们在组件上绑定`bind事件名`，这个事件名是组件里通过`this.triggerEvent(事件名，值)`传递的事件名，然后通过事件来获取值即可

##### 第三种：this.selectComponent()方法

如果以上两种方式不足以满足需要，父组件还可以通过 `this.selectComponent` 方法获取子组件实例对象，这样就可以直接访问组件的任意数据和方法。

##### 第四种：全局globalData

我们只需把要传递的数据存储到app.js文件中的globalData即可，然后通过`getApp()`方法获取到小程序全局唯一的 App 实例即可拿到数据。

### 六、文件下载保存

&emsp;文件一般粗略的分为音频、视频、图片、文档（word/excel/ppt/pdf）等，小程序文件下载功能我感觉有点儿鸡肋，小程序不就是要小而简单吗？

小程序提供了下载的API—[wx.downloadFile(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html)下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径 (本地路径)，单次下载允许的最大文件为 200MB。
拿到本地临时路径后我们再通过小程序提供的其它API把文件保存在手机上。

##### 图片下载

&emsp;小程序开发文档给我提供了API—[wx.saveImageToPhotosAlbum()](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html)保存图片到系统相册，注意第一次可能需要提示保存授权，如果拒绝了后面就会保存失败，如果不小心拒绝了授权，那么在fail的回调中，我们调用[wx.openSetting(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html)调起客户端小程序设置界面，返回用户设置的操作结果。**设置界面只会出现小程序已经向用户请求过的[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。

##### 视频下载

&emsp;小程序同样提供了API—[wx.saveVideoToPhotosAlbum(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html)保存视频到系统相册，支持mp4视频格式。

##### 文档下载

&emsp;文档和音频通常情况下就算我们下载了也在手机上很难找到，何况IOS系统根本就没有文件管理，你让用户到哪里找，那产品需求这就没有办法实现了吗？非也非也，我们可以曲线救国，作为一个高手之高高手，怎么能被这么一点儿小困难难倒。

&emsp;经过把文档翻烂终于找到了一个办法，小程序给我提供了一个[wx.openDocument(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html)的API，其作用是新开页面打开文档，如果我们把文档打开了是不是就可以利用微信的功能转发保存了，经过实验，完美！

下面是主要功能的伪代码：

```js
wx.downloadFile({
  url: '文件地址链接',
  success: (res) => {
    const filePath = res.tempFilePath
    wx.hideLoading()
    if (视频) {
      wx.saveVideoToPhotosAlbum({
        filePath: filePath,
        success: (res) => {
          this.showToast()
        },
        fail: (err) => {
          if (err.errMsg.indexOf('deny') > -1) {
            this.saveAuth()
          } else {
            this.showToast(err.errMsg, 'none', 3000)
          }
        }
      })
    } else if (图片) {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: (res) => {
          this.showToast()
        },
        fail: (err) => {
          if (err.errMsg.indexOf('deny') > -1) {
            this.saveAuth()
          } else {
            this.showToast(err.errMsg, 'none', 3000)
          }
        }
      })
    } else if (文档) {
      wx.openDocument({
        filePath: filePath,
        showMenu: true,
        fail: (err) => {
          console.log('openDocument fail', err)
          this.showToast(err.errMsg, 'none')
        }
      })
    } else { // 音频
      const fs = wx.getFileSystemManager()
      fs.saveFile({
        tempFilePath: filePath,
        filePath: `${wx.env.USER_DATA_PATH}/${info.resource_name}`,
        success: (res) => {
          this.showToast()
        }
      })
    }
  },
  fail: (err) => {
    console.log('fail', err)
    this.showToast(err.errMsg, 'none')
  }
})
```

### 七、音频总时长和播放倍速的bug处理

![背景音频播放.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4f02a6282bb40a59261db1f8cb980c8~tplv-k3u1fbpfcp-zoom-1.image)

##### 音频时长获取

&emsp;现在主流音乐小程序都是通过背景音频来播放的，小程序提供了[wx.getBackgroundAudioManager()](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/BackgroundAudioManager.html)获取全局唯一的背景音频管理器。 因为这样可以实现小程序切入后台，如果音频处于播放状态，可以继续播放。QQ音乐、酷狗、网易云、酷我等小程序都是通过背景音频管理器来播放的。

&emsp;然而大部分情况下获取音频总时长我们只需通过监听背景音频进入可播放状态事件`onCanplay()`来获取总时间即可，大部分机型都没有问题，但部分安卓机可能获取不到，比如红米手机，那么我们怎么兼容所有机型呢？

**解决方法：**

&emsp;首先我们在onCanplay监听事件中异步延时获取时长，但是这种不保证所有机型都成功，但这么处理后99%的机型都没问题了，如果遇到某些手机还是不行，那么第一是把手机砸了，第二在监听播放进度更新事件[onTimeUpdate()](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/BackgroundAudioManager.onTimeUpdate.html)中获取。

##### 背景音频播放速度更改不生效问题

&emsp;播放速度范围 0.5-2.0，默认为 1。根据文档我们要更改播放速度，只需要获取全局唯一的背景音频管理器然后设置更改`playbackRate`值即可，但是往往事与愿违，总是跟你想的不一样，难受，想哭。然后我就在微信开发社区看到同样的问题，发现官方人员回复这个问题会在后续修复，我人麻了，如果需求不能按时交付那我不就G了，搞不好会拿去祭天。好在黄天不负有心，我终于看到有大佬也遇到类似问题了，好像是目前如果重设播放速率后需要重新更新src才会生效，那既然这样我试了下确实可以。

**解决方法：**

&emsp;当我们更改`playbackRate`的之后，调用`stop()`方法停止播放销毁然后重新创建播放器，然后继续`startTime`时间设为销毁时的当前时间，这样不就看起来是连续播放的吗，主要部分代码如下：

```js
// 创建音频
createAudio () {
  const bgAudio = wx.getBackgroundAudioManager()
  bgAudio.title = '旅行的意义'
  bgAudio.coverImgUrl = 'http://p2.music.126.net/O5MGnD9aH25GrTJNzjogrQ==/870813209198983.jpg?param=130y130'
  // 设置了 src 之后会自动播放
  bgAudio.src = this.data.audio.url
  bgAudio.playbackRate = this.data.audio.playbackRate
  bgAudio.startTime = this.data.audio.currentTime
  // console.log(bgAudio)
  bgAudio.onCanplay(() => {
    console.log('可以播放了', bgAudio.paused, bgAudio.duration)
    // onCanplay事件会多次触发（seek/stop等方法），设置src会自动播放，所以不是isPlaying的时候就暂停
    if (!this.data.audio.isPlaying) {
      bgAudio.pause()
    }
    if (!this.data.audio.durationTime) {
      setTimeout(() => {
        this.setData({
          ['audio.durationTime']: bgAudio.duration,
          durationTime: this.transformTime(bgAudio.duration)
        })
      }, 100)
    }
  })
  bgAudio.onError((res) => {
    console.log('error>>>>', res)
    wx.showToast({
      title: '音频加载出错~',
      icon: 'none',
      duration: 2000
    })
  })
  bgAudio.onTimeUpdate(() => {
    console.log('onTimeUpdate>>>>', this.data.audio.durationTime, bgAudio.duration)
    // 如果onCanplay事件没有获取到歌曲总时长则在这里监听获取
    if (!this.data.audio.durationTime) {
      this.setData({
        ['audio.durationTime']: bgAudio.duration,
        durationTime: this.transformTime(bgAudio.duration)
      })
    }
    this.setData({
      ['audio.currentTime']: bgAudio.currentTime,
      ['audio.progress']: Math.round(this.data.audio.currentTime / this.data.audio.durationTime * 100),
      currentTime: this.transformTime(bgAudio.currentTime)
    })
  })
  bgAudio.onStop(() => {
    console.log('销毁')
    this.setData({
      ['audio.isPlaying']: false
    })
    this.createAudio()
  })
  bgAudio.onEnded(() => {
    // 播完了所有数据都被清理了，重新创建音频
    console.log('onEnded')
    this.setData({
      ['audio.isPlaying']: false,
      ['audio.currentTime']: 0,
      ['audio.progress']: 0
    })
    this.createAudio()
  })
},
play () {
  console.log('播放')
  const bgAudio = wx.getBackgroundAudioManager()
  bgAudio.play()
  this.setData({
    ['audio.isPlaying']: true
  })
},
pause () {
  const bgAudio = wx.getBackgroundAudioManager()
  bgAudio.pause()
  this.setData({
    ['audio.isPlaying']: false
  })
},
changeRate () {
  const _rate = this.data.audio.playbackRate >= 2 ? 0.5 : this.data.audio.playbackRate + 0.5
  this.setData({
    ['audio.playbackRate']: _rate,
    playbackRate: _rate.toFixed(1)
  })
  const bgAudio = wx.getBackgroundAudioManager()
  bgAudio.playbackRate = this.data.audio.playbackRate
  // 需要重新更新src才会生效，所以这里调用销毁然后重新创建
  bgAudio.stop()
  if (this.data.audio.isPlaying) {
    setTimeout(() => {
      this.play()
    }, 100)
  }
},
changeAudioProgress (event) {
  console.log('进度条拖动')
  const bgAudio = wx.getBackgroundAudioManager()
  const val = event.detail.value
  console.log(val, this.data.audio.durationTime)
  this.setData({
    ['audio.progress']: val,
    ['audio.currentTime']: this.data.audio.durationTime * val / 100,
    currentTime: this.transformTime(this.data.audio.durationTime * val / 100)
  })
  bgAudio.seek(this.data.audio.currentTime)
},
// 前进后退15s
changeSeek (event) {
  if (event.target.dataset.seek === 'prev') {
    // console.log('后退15s')
    const _prevTime = this.data.audio.currentTime <= 0 ? 0 : this.data.audio.currentTime - 15
    this.setData({
      ['audio.currentTime']: _prevTime,
      currentTime: this.transformTime(_prevTime)
    })
  }
  if (event.target.dataset.seek === 'next') {
    // console.log('前进15s')
    const _nextTime = this.data.audio.currentTime >= this.data.audio.durationTime ? this.data.audio.durationTime : this.data.audio.currentTime + 15
    this.setData({
      ['audio.currentTime']: _nextTime,
      currentTime: this.transformTime(_nextTime)
    })
  }
  // console.log(this.data.audio.currentTime, this.data.currentTime)
  this.setData({
    ['audio.progress']: parseInt(this.data.audio.currentTime / this.data.audio.durationTime * 100)
  })
  const bgAudio = wx.getBackgroundAudioManager()
  bgAudio.seek(this.data.audio.currentTime)
}
```

### 八、滚动穿透

&emsp;什么是滚动穿透呢？如果页面有弹窗且内容过长需要滚动，弹窗滚动同时，底部页面跟着滚动，给我们的感觉就像滚动穿透了一样。下图就是滚动穿透了效果：
![GIF 滚动穿透.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e950042d5558483b8ea4b504c9e16163~tplv-k3u1fbpfcp-zoom-1.image)

&emsp;滚动穿透不管是在H5页面还是小程序中都存在，我只能说好恶心，不过我们还是有方法去解决，下面我就介绍几种处理小程序滚动穿透的方案。

##### 方法一：添加 catchtouchmove 事件

&emsp;给底部页面绑定一个`catchtouchmove`事件，然后在事件函数里返回return true，这样就相当于禁止了页面滑动。但这种方案只适用于弹窗不需滑动的情况，因为同样会禁止弹窗滑动，如果一定要用这种方案又想弹窗滑动也不是没有办法，只需在弹窗部分使用`scroll-view`组件来实现滑动就可以实现。

##### 方法二：scroll-view组件

&emsp;底部页和弹窗滑动部分使用scroll-view组件包着也可以解决穿透问题，但是有个特殊情况，如果是自定义的导航栏且弹窗没有遮住导航栏的情况下，IOS系统可能还能让页面上下抖动，这个是ios系统网页特性，这个也好处理，我们结合方法一使用的即可。

##### 方法三：fixed固定定位

&emsp;当我们点击显示弹窗时，让底部页面变为固定定位就无法滑动了，但是有个缺点就是，去掉fixed时会让页面回到顶部，所以不推荐此方法。

##### 方法四：page-mate

&emsp;页面属性配置节点[page-meta](https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html)，用于指定页面的一些属性、监听页面事件，只能是页面内的第一个节点。

```html
<page-meta page-style="overflow: {{visible ? 'hidden' : 'visible'}}" />
```

但是这个方案有个问题是基础库 2.9.0 开始支持，兼容性还是比较差的，再过一年的话这个方案就是最佳方案了，**推荐**。

##### 方法五：wx.setPageStyle()方法

&emsp;这个方法在文档没有写，但是就是有效，原理跟方法四一样，都是给page添加属性让其无法滑动，而且这个方法比page-mate兼容性更好，目前用来毫无问题，**推荐**。

```js
showPopup () {
  wx.setPageStyle({
    style: {
      overflow: 'hidden'
    }
  })
},
closePopup () {
  wx.setPageStyle({
    style: {
      overflow: 'auto'
    }
  })
}
```

### 九、setData仅修改对象某个属性

&emsp;以[数据路径](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page-prototype-setData-Object-data-Function-callback)形式改变数组中的某一项或对象的某个属性，如 `this.setData({'array[2].message': 'newVal', 'a.b.c.d': 'newVal'})`

```js
this.setData({
  'audio.currentTime':  999
})
```

### 十、设计图px和开发rpx换算

&emsp;这个问题看文档就可以了[尺寸单位](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)，还拿出来说主要是因为之前面试问如果设计图是375像素的话开发时怎么把px兑换成rpx，面试同学开发过小程序却还回答不出来，所以拿出来说下可能对于第一开发小程序的同学和新手还是有点儿帮助的吧。

![rpx](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a204d3d68779432f8df94e8220f12f51~tplv-k3u1fbpfcp-zoom-1.image)

其实说白了，建议我们使用iPhone6作为设计稿，一般就是750px，所以在开发小程序就是1:1不用换算，如果是376px的设计稿，那么我们写WXS就是2倍rpx。

### 十一、position: sticky使用条件

最开始说过[sticky粘性定位](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)可能不生效，这里我总结了几条使用条件：

1、父元素不能overflow:hidden或者overflow:auto属性。

2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位

3、父元素的高度不能低于sticky元素的高度

4、sticky元素仅在其父元素内生效

在自定义导航栏组件里面设置的sticky其实是不生效的，因为不满足第4点，所以我们需要在其父元素页面设置sticky元素来满足要求，代码如下：
```html
<view class="nav-bar" style="position: sticky; top: {{-stickyTop}}px;">
  <nav-bar isPullDowning="{{isPullDowning}}" marginTop="{{marginTop}}" bindgetStickyTop="getStickyTop"></nav-bar>
</view>
```

### 总结 

&emsp;上面就是我开发小程序的一些简单总结，想下载代码运行查看可点击[>>这里<<](https://developers.weixin.qq.com/s/YrrsbomW76Kv)，公司有风控要求项目一些东西和代码不方贴出来，所以就简单写了一个demo，对于第一次接触小程序的伙伴来说可能有点儿帮助，如果总结的不到位或者有错误，希望大佬们指出，完整的代码在我的[GitHub](https://github.com/xrwben/miniprogram-summary)仓库\~

***

本文是笔者总结编撰，如有偏颇，欢迎留言指正，若您觉得本文对你有用，不妨点个赞\~

关于作者：

[GitHub](https://github.com/xrwben)

[掘金](https://juejin.cn/user/2647279730444574/posts)


"subPackages": [
  {
    "root": "pages/subPackage",
    "pages": [
      "index/index",
      "logs/logs"
    ]
  }
]