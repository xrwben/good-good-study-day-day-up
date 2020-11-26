/*
	rem.js
*/
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

  function recalc() {
    var designWidth = 750
    var clientWidth = docEl.clientWidth
    if (!clientWidth || clientWidth > designWidth) return
    docEl.style.fontSize = (100 * clientWidth / designWidth) + 'px'
  }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)


/*
	dpi设置
*/
(function () {
  var width = parseInt(window.screen.width)
  var designWidth = 450
  var scale = width / designWidth
  var userAgent = navigator.userAgent.toLowerCase()
  var metaHead = '<meta name="viewport" content="width=' + designWidth + ','
  if (/android (\d+\.\d+)/.test(userAgent)) {
    if (parseFloat(RegExp.$1) > 2.3) metaHead += 'minimum-scale=' + scale + ',maximum-scale=' + scale + ','
  } else {
    metaHead += 'user-scalable=no,';
  }
  metaHead += 'target-densitydpi=device-dpi">';
  document.write(metaHead);
})()