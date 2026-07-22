/**
 * 轻量级性能监控 SDK
 * 可在原生 HTML 中直接使用
 * 基于腾讯云 Aegis 架构简化
 * 
 * @usage
 * <script src="/performance-monitor-sdk.js"></script>
 * <script>
 *   var monitor = new PerformanceMonitorSDK({
 *     appName: 'my-app',
 *     appNameCn: '我的应用',
 *     basePrefix: 'MY_APP',
 *     reportUrl: 'https://dc.fenqile.com/route0031/dataCollect/uploadWebDataSingleReport.json',
 *     
 *     // 用户标识
 *     mid: 'user123',        // 用户唯一ID
 *     min: 'zhangsan',       // 用户名称
 *     
 *     // 功能开关
 *     enableWebVitals: true,
 *     enableWhiteScreen: true,
 *     enablePageLoad: true,
 *     enableMemoryMonitor: true,
 *     enableErrorMonitor: true,    // 错误监控总开关
 *     enableJSError: true,         // JS运行时错误
 *     enablePromiseError: true,    // Promise未捕获错误
 *     enableResourceError: true,   // 资源加载错误
 *     
 *     // 调试和限流
 *     enableDebugLog: false,       // 是否输出调试日志（生产环境建议false）
 *     errorSampleRate: 1.0,        // 错误采样率 0-1，1表示100%上报
 *     maxErrorCount: 50,           // 单次会话最多上报错误数
 *     
 *     // 项目特定的全局扩展信息
 *     extendGlobalInfo: {
 *       projectId: 'xxx',       // 项目特定参数
 *       moduleId: 'yyy'         // 其他自定义参数
 *     }
 *   })
 * </script>
 */

;(function (window) {
    'use strict'

    /**
     * 性能监控 SDK 核心类
     */
    function PerformanceMonitorSDK(config) {
        try {
            // 默认配置
            this.config = {
                appName: config.appName || 'app',
                appNameCn: config.appNameCn || '应用',
                basePrefix: config.basePrefix || 'APP',
                reportUrl: config.reportUrl || '',
                mid: config.mid || '', // 用户唯一标识
                min: config.min || '', // 用户名称
                enableWebVitals: config.enableWebVitals !== false,
                enableWhiteScreen: config.enableWhiteScreen !== false,
                enablePageLoad: config.enablePageLoad !== false,
                enableMemoryMonitor: config.enableMemoryMonitor !== false,
                enableErrorMonitor: config.enableErrorMonitor !== false, // 错误监控总开关
                enableJSError: config.enableJSError !== false, // JS运行时错误
                enablePromiseError: config.enablePromiseError !== false, // Promise未捕获错误
                enableResourceError: config.enableResourceError !== false, // 资源加载错误
                enableDebugLog: config.enableDebugLog === true, // 是否输出调试日志，默认false
                errorSampleRate: config.errorSampleRate !== undefined ? config.errorSampleRate : 1.0, // 错误采样率，默认100%
                maxErrorCount: config.maxErrorCount || 50, // 单次会话最多上报错误数
                whiteScreenTimeout: config.whiteScreenTimeout || 5000,
                memoryCheckInterval: config.memoryCheckInterval || 30000, // 内存检测间隔(ms)，默认30秒
                memoryWarningThreshold: config.memoryWarningThreshold || 0.8, // 内存告警阈值，默认80%
                memoryCriticalThreshold: config.memoryCriticalThreshold || 0.9, // 内存危险阈值，默认90%
                batchSize: config.batchSize || 10,
                reportDelay: config.reportDelay || 3000,
                extendGlobalInfo: config.extendGlobalInfo || {} // 项目特定的全局扩展信息
            }

            this.reportQueue = []
            this.timer = null
            this.deviceInfo = null
            this.hasReported = {
                fcp: false,
                lcp: false,
                fid: false,
                cls: false,
                ttfb: false,
                whiteScreen: false,
                pageLoad: false,
                memoryWarning: false,
                memoryCritical: false
            }

            this.memoryCheckTimer = null
            this.lastMemoryUsage = 0
            this.sdkError = false // SDK错误标记
            
            // 错误监控状态
            this.errorCount = 0 // 当前会话已上报错误数
            this.errorCache = {} // 错误去重缓存 {errorKey: count}
            this.errorHandlers = [] // 错误处理器引用，用于销毁

            this.init()
        } catch (error) {
            this.sdkError = true
            this.silentError('SDK初始化失败', error)
        }
    }

    /**
     * 静默错误处理 - SDK内部错误不对外抛出
     */
    PerformanceMonitorSDK.prototype.silentError = function (message, error) {
        try {
            // 只在配置开启调试日志时输出
            if (this.config && this.config.enableDebugLog) {
                console.warn('[PerformanceSDK]', message, error)
            }
        } catch (e) {
            // 连错误日志都失败了，完全静默
        }
    }

    /**
     * 安全执行函数 - 确保单个功能失败不影响其他功能
     */
    PerformanceMonitorSDK.prototype.safeExecute = function (fn, context, args) {
        try {
            if (this.sdkError) return // SDK已损坏，不再执行
            return fn.apply(context || this, args || [])
        } catch (error) {
            this.silentError('功能执行失败', error)
            return null
        }
    }

    /**
     * 初始化
     */
    PerformanceMonitorSDK.prototype.init = function () {
        this.safeExecute(function () {
            var self = this
            this.deviceInfo = this.getDeviceInfo()

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () {
                    self.safeExecute(self.setupMonitors, self)
                })
            } else {
                this.setupMonitors()
            }

            // 页面卸载前上报
            window.addEventListener('beforeunload', function () {
                self.safeExecute(self.flush, self)
            })
        }, this)
    }

    /**
     * 设置监控
     */
    PerformanceMonitorSDK.prototype.setupMonitors = function () {
        this.safeExecute(function () {
            if (this.config.enableWebVitals) {
                this.safeExecute(this.setupWebVitalsMonitor, this)
            }
            if (this.config.enableWhiteScreen) {
                this.safeExecute(this.setupWhiteScreenMonitor, this)
            }
            if (this.config.enablePageLoad) {
                this.safeExecute(this.setupPageLoadMonitor, this)
            }
            if (this.config.enableMemoryMonitor) {
                this.safeExecute(this.setupMemoryMonitor, this)
            }
            if (this.config.enableErrorMonitor) {
                this.safeExecute(this.setupErrorMonitor, this)
            }
        }, this)
    }

    /**
     * 获取设备信息
     */
    PerformanceMonitorSDK.prototype.getDeviceInfo = function () {
        var ua = navigator.userAgent
        var system = 'Unknown'
        var systemVersion = ''

        if (ua.indexOf('Mac OS') > -1) {
            system = 'Mac OS'
            var match = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
            if (match) systemVersion = match[1].replace(/_/g, '.')
        } else if (ua.indexOf('Windows') > -1) {
            system = 'Windows'
            var match = ua.match(/Windows NT (\d+\.\d+)/)
            if (match) systemVersion = match[1]
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
            system = 'iOS'
            var match = ua.match(/OS (\d+[._]\d+)/)
            if (match) systemVersion = match[1].replace(/_/g, '.')
        } else if (ua.indexOf('Android') > -1) {
            system = 'Android'
            var match = ua.match(/Android (\d+\.\d+)/)
            if (match) systemVersion = match[1]
        } else if (ua.indexOf('Linux') > -1) {
            system = 'Linux'
        }

        return {
            system: system,
            systemVersion: systemVersion,
            screenSize: window.screen.width + '*' + window.screen.height,
            ua: ua
        }
    }

    /**
     * 设置 Web Vitals 监控
     */
    PerformanceMonitorSDK.prototype.setupWebVitalsMonitor = function () {
        var self = this

        // 监听 FCP
        if ('PerformanceObserver' in window) {
            try {
                var fcpObserver = new PerformanceObserver(function (list) {
                    var entries = list.getEntries()
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i]
                        if (entry.name === 'first-contentful-paint' && !self.hasReported.fcp) {
                            self.hasReported.fcp = true
                            var value = entry.startTime
                            self.reportMetric('FCP', value, self.getRating(value, [1800, 3000]))
                            fcpObserver.disconnect()
                        }
                    }
                })
                fcpObserver.observe({ entryTypes: ['paint'] })
            } catch (e) {}

            // 监听 LCP
            try {
                var lcpObserver = new PerformanceObserver(function (list) {
                    var entries = list.getEntries()
                    var lastEntry = entries[entries.length - 1]
                    if (lastEntry) {
                        var value = lastEntry.renderTime || lastEntry.loadTime
                        self.reportMetric('LCP', value, self.getRating(value, [2500, 4000]))
                    }
                })
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
                
                // LCP 在页面交互或隐藏后就不再更新
                setTimeout(function () {
                    if (!self.hasReported.lcp) {
                        self.hasReported.lcp = true
                        lcpObserver.disconnect()
                    }
                }, 10000)
            } catch (e) {}

            // 监听 FID
            try {
                var fidObserver = new PerformanceObserver(function (list) {
                    var entries = list.getEntries()
                    if (entries.length > 0 && !self.hasReported.fid) {
                        self.hasReported.fid = true
                        var entry = entries[0]
                        var value = entry.processingStart - entry.startTime
                        self.reportMetric('FID', value, self.getRating(value, [100, 300]))
                        fidObserver.disconnect()
                    }
                })
                fidObserver.observe({ entryTypes: ['first-input'] })
            } catch (e) {}

            // 监听 CLS
            try {
                var clsValue = 0
                var clsObserver = new PerformanceObserver(function (list) {
                    var entries = list.getEntries()
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i]
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value
                        }
                    }
                })
                clsObserver.observe({ entryTypes: ['layout-shift'] })

                // 页面隐藏时上报 CLS
                window.addEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'hidden' && !self.hasReported.cls) {
                        self.hasReported.cls = true
                        self.reportMetric('CLS', clsValue, self.getRating(clsValue, [0.1, 0.25]))
                        clsObserver.disconnect()
                    }
                })
            } catch (e) {}

            // 监听 TTFB
            window.addEventListener('load', function () {
                if (!self.hasReported.ttfb && performance.timing) {
                    self.hasReported.ttfb = true
                    var value = performance.timing.responseStart - performance.timing.requestStart
                    self.reportMetric('TTFB', value, self.getRating(value, [800, 1800]))
                }
            })
        }
    }

    /**
     * 获取评级
     */
    PerformanceMonitorSDK.prototype.getRating = function (value, thresholds) {
        return this.safeExecute(function () {
            if (value <= thresholds[0]) return 'good'
            if (value <= thresholds[1]) return 'needs-improvement'
            return 'poor'
        }, this) || 'poor' // 发生错误时默认返回 poor
    }

    /**
     * 上报 Web Vitals 指标
     */
    PerformanceMonitorSDK.prototype.reportMetric = function (name, value, rating) {
        this.safeExecute(function () {
            var navigationType = 'navigate'
            if (performance.navigation) {
                var navType = performance.navigation.type
                if (navType === 1) navigationType = 'reload'
                else if (navType === 2) navigationType = 'back-forward'
            }

            this.report({
                type: 'WEB_VITALS',
                eventPos: 'PERFORMANCE.WEB_VITALS.' + name + '.EXPOSE.' + (rating === 'good' ? 'SUCCESS' : 'ERROR'),
                eventPosName: this.config.appNameCn + '-页面关键指标-' + name,
                eventCode: name.toLowerCase() + '_' + rating,
                extendInfo: {
                    monitorType: 'web_vitals',
                    metricName: name,
                    metricValue: value,
                    rating: rating,
                    delta: value,
                    metricId: name.toLowerCase() + '-' + Date.now(),
                    navigationType: navigationType
                }
            })
        }, this)
    }

    /**
     * 设置白屏监控
     */
    PerformanceMonitorSDK.prototype.setupWhiteScreenMonitor = function () {
        var self = this
        var checkWhiteScreen = function () {
            if (self.hasReported.whiteScreen) return
            self.hasReported.whiteScreen = true

            var result = self.detectWhiteScreen()
            
            // 无论白屏与否都上报
            self.report({
                type: 'WHITE_SCREEN',
                eventPos: result.isWhiteScreen 
                    ? 'PERFORMANCE.PAGE_LOAD_WHITE_SCREEN.EXPOSE.ERROR' 
                    : 'PERFORMANCE.PAGE_LOAD_SUCCESS.EXPOSE.SUCCESS',
                eventPosName: self.config.appNameCn + '-' + (result.isWhiteScreen ? '页面加载白屏' : '页面加载成功'),
                eventCode: result.isWhiteScreen ? 'page_load_white_screen' : 'page_load_success',
                extendInfo: {
                    monitorType: 'white_screen',
                    isWhiteScreen: result.isWhiteScreen,
                    reason: result.reason,
                    detectionDuration: result.duration,
                    emptyPoints: result.emptyPoints,
                    totalPoints: result.totalPoints,
                    emptyPointsRatio: result.totalPoints > 0 ? (result.emptyPoints / result.totalPoints).toFixed(2) : '0'
                }
            })
        }

        if (document.readyState === 'complete') {
            setTimeout(checkWhiteScreen, this.config.whiteScreenTimeout)
        } else {
            window.addEventListener('load', function () {
                setTimeout(checkWhiteScreen, self.config.whiteScreenTimeout)
            })
        }
    }

    /**
     * 9点采样法检测白屏
     */
    PerformanceMonitorSDK.prototype.detectWhiteScreen = function () {
        return this.safeExecute(function () {
            var startTime = Date.now()
            try {
                var w = window.innerWidth
                var h = window.innerHeight
                var points = [
                    [w * 0.25, h * 0.25], [w * 0.5, h * 0.25], [w * 0.75, h * 0.25],
                    [w * 0.25, h * 0.5],  [w * 0.5, h * 0.5],  [w * 0.75, h * 0.5],
                    [w * 0.25, h * 0.75], [w * 0.5, h * 0.75], [w * 0.75, h * 0.75]
                ]

                var emptyCount = 0
                var ignoreTags = ['HTML', 'BODY', 'SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK']

                for (var i = 0; i < points.length; i++) {
                    var el = document.elementFromPoint(points[i][0], points[i][1])
                    if (!el || ignoreTags.indexOf(el.tagName) > -1) {
                        emptyCount++
                    }
                }

                var isWhiteScreen = emptyCount >= points.length * 0.8

                return {
                    isWhiteScreen: isWhiteScreen,
                    reason: isWhiteScreen ? emptyCount + '/' + points.length + ' 采样点为空白' : undefined,
                    duration: Date.now() - startTime,
                    emptyPoints: emptyCount,
                    totalPoints: points.length
                }
            } catch (error) {
                return {
                    isWhiteScreen: false,
                    reason: '检测异常',
                    duration: Date.now() - startTime
                }
            }
        }, this) || {
            isWhiteScreen: false,
            reason: '检测失败',
            duration: 0,
            emptyPoints: 0,
            totalPoints: 9
        }
    }

    /**
     * 设置页面加载监控
     */
    PerformanceMonitorSDK.prototype.setupPageLoadMonitor = function () {
        var self = this
        var reportPageLoad = function () {
            if (self.hasReported.pageLoad) return
            self.hasReported.pageLoad = true

            var metrics = self.getPageLoadMetrics()
            if (metrics) {
                self.report({
                    type: 'PAGE_LOAD',
                    eventPos: 'PERFORMANCE.PAGE_LOAD.EXPOSE.SUCCESS',
                    eventPosName: self.config.appNameCn + ' - 页面加载监控',
                    eventCode: 'page_load_complete',
                    extendInfo: {
                        monitorType: 'page_load',
                        dnsTime: metrics.dnsTime,
                        tcpTime: metrics.tcpTime,
                        requestTime: metrics.requestTime,
                        responseTime: metrics.responseTime,
                        domParseTime: metrics.domParseTime,
                        resourceLoadTime: metrics.resourceLoadTime,
                        domContentLoadedTime: metrics.domContentLoadedTime,
                        loadTime: metrics.loadTime
                    }
                })
            }
        }

        if (document.readyState === 'complete') {
            reportPageLoad()
        } else {
            window.addEventListener('load', reportPageLoad)
        }
    }

    /**
     * 获取页面加载指标
     */
    PerformanceMonitorSDK.prototype.getPageLoadMetrics = function () {
        return this.safeExecute(function () {
            if (!performance || !performance.timing) {
                return null
            }

            var timing = performance.timing
            var navigationStart = timing.navigationStart

            return {
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                tcpTime: timing.connectEnd - timing.connectStart,
                requestTime: timing.responseStart - timing.requestStart,
                responseTime: timing.responseEnd - timing.responseStart,
                domParseTime: timing.domInteractive - timing.domLoading,
                resourceLoadTime: timing.loadEventStart - timing.domContentLoadedEventEnd,
                domContentLoadedTime: timing.domContentLoadedEventEnd - navigationStart,
                loadTime: timing.loadEventEnd - navigationStart
            }
        }, this)
    }

    /**
     * 设置内存监控
     */
    PerformanceMonitorSDK.prototype.setupMemoryMonitor = function () {
        var self = this

        // 检查浏览器是否支持 Memory API (仅 Chrome/Edge 支持)
        if (!performance.memory) {
            console.warn('[' + this.config.appName + '] Memory API 不支持，内存监控已禁用')
            return
        }

        console.log('[' + this.config.appName + '] 内存监控已启动，采样间隔：' + (this.config.memoryCheckInterval / 1000) + '秒')

        // 定期采样内存使用情况
        var sampleMemory = function () {
            try {
                var memoryInfo = self.getMemoryInfo()
                if (!memoryInfo) {
                    console.warn('[' + self.config.appName + '] 获取内存信息失败')
                    return
                }

                console.log('[' + self.config.appName + '] 内存采样：' + memoryInfo.usedMB + 'MB / ' + memoryInfo.limitMB + 'MB (' + memoryInfo.usagePercent + '%)')

                // 直接上报内存采样数据，不做阈值判断
                self.report({
                    type: 'MEMORY',
                    eventPos: 'PERFORMANCE.MEMORY_SAMPLE.EXPOSE.SUCCESS',
                    eventPosName: self.config.appNameCn + ' - 内存使用采样',
                    eventCode: 'memory_sample',
                    extendInfo: {
                        monitorType: 'memory',
                        memoryType: 'sample',
                        usedJSHeapSize: memoryInfo.usedJSHeapSize,
                        totalJSHeapSize: memoryInfo.totalJSHeapSize,
                        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
                        usageRatio: memoryInfo.usageRatio,
                        usagePercent: memoryInfo.usagePercent,
                        usedMB: memoryInfo.usedMB,
                        totalMB: memoryInfo.totalMB,
                        limitMB: memoryInfo.limitMB,
                        trend: self.getMemoryTrend(memoryInfo.usedJSHeapSize)
                    }
                })

                // 记录本次内存使用量，用于趋势分析
                self.lastMemoryUsage = memoryInfo.usedJSHeapSize
            } catch (error) {
                console.error('[' + self.config.appName + '] 内存采样异常：', error)
            }
        }

        // 立即采样一次
        sampleMemory()

        // 定期采样（确保定时器不会被清除）
        if (this.memoryCheckTimer) {
            clearInterval(this.memoryCheckTimer)
        }
        this.memoryCheckTimer = setInterval(sampleMemory, this.config.memoryCheckInterval)
        console.log('[' + this.config.appName + '] 内存定时器已设置，ID：' + this.memoryCheckTimer)

        // 监听页面可见性变化，当页面从后台切换回来时采样
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                sampleMemory()
            }
        })

        // 监听页面卸载（检测疑似崩溃）
        window.addEventListener('beforeunload', function () {
            var memoryInfo = self.getMemoryInfo()
            if (memoryInfo) {
                // 页面卸载时记录内存状态，用于崩溃分析
                self.report({
                    type: 'MEMORY',
                    eventPos: 'PERFORMANCE.MEMORY_UNLOAD.EXPOSE.SUCCESS',
                    eventPosName: self.config.appNameCn + ' - 页面卸载内存快照',
                    eventCode: 'memory_unload',
                    extendInfo: {
                        monitorType: 'memory',
                        memoryType: 'unload',
                        usedJSHeapSize: memoryInfo.usedJSHeapSize,
                        totalJSHeapSize: memoryInfo.totalJSHeapSize,
                        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
                        usageRatio: memoryInfo.usageRatio,
                        usagePercent: memoryInfo.usagePercent,
                        usedMB: memoryInfo.usedMB,
                        totalMB: memoryInfo.totalMB,
                        limitMB: memoryInfo.limitMB,
                        trend: self.getMemoryTrend(memoryInfo.usedJSHeapSize)
                    }
                })
                self.flush() // 立即上报
            }
        })
    }

    /**
     * 获取内存信息
     */
    PerformanceMonitorSDK.prototype.getMemoryInfo = function () {
        return this.safeExecute(function () {
            if (!performance.memory) {
                return null
            }

            var memory = performance.memory
            var usedJSHeapSize = memory.usedJSHeapSize // 已使用的堆内存
            var totalJSHeapSize = memory.totalJSHeapSize // 堆内存总大小
            var jsHeapSizeLimit = memory.jsHeapSizeLimit // 堆内存上限
            var usageRatio = usedJSHeapSize / jsHeapSizeLimit // 使用率（相对于上限）

            return {
                usedJSHeapSize: usedJSHeapSize,
                totalJSHeapSize: totalJSHeapSize,
                jsHeapSizeLimit: jsHeapSizeLimit,
                usageRatio: usageRatio,
                usagePercent: parseFloat((usageRatio * 100).toFixed(2)),
                usedMB: parseFloat((usedJSHeapSize / 1024 / 1024).toFixed(2)),
                totalMB: parseFloat((totalJSHeapSize / 1024 / 1024).toFixed(2)),
                limitMB: parseFloat((jsHeapSizeLimit / 1024 / 1024).toFixed(2))
            }
        }, this)
    }

    /**
     * 获取内存使用趋势
     */
    PerformanceMonitorSDK.prototype.getMemoryTrend = function (currentUsage) {
        return this.safeExecute(function () {
            if (!this.lastMemoryUsage) {
                return 'initial'
            }

            var diff = currentUsage - this.lastMemoryUsage
            var diffPercent = ((diff / this.lastMemoryUsage) * 100).toFixed(2)

            if (diff > 0) {
                return 'increasing (+' + diffPercent + '%)'
            } else if (diff < 0) {
                return 'decreasing (' + diffPercent + '%)'
            } else {
                return 'stable'
            }
        }, this) || 'unknown'
    }

    /**
     * 设置错误监控
     */
    PerformanceMonitorSDK.prototype.setupErrorMonitor = function () {
        var self = this

        // 1. JS 运行时错误监控 - 使用 window.onerror
        if (this.config.enableJSError) {
            var originalOnError = window.onerror
            var jsErrorHandler = function (message, source, lineno, colno, error) {
                self.safeExecute(function () {
                    // 跨域脚本错误特殊处理
                    if (message === 'Script error.' && lineno === 0 && colno === 0) {
                        self.reportError({
                            errorType: 'js_error',
                            errorCategory: 'cross_origin',
                            message: 'Script error (跨域脚本错误)',
                            filename: source || 'unknown',
                            stack: 'Cross-origin script error, cannot get details',
                            lineno: 0,
                            colno: 0
                        })
                        return
                    }

                    // 正常 JS 错误
                    self.reportError({
                        errorType: 'js_error',
                        errorCategory: error && error.name ? error.name : 'Error',
                        message: message || 'Unknown error',
                        filename: source || '',
                        lineno: lineno || 0,
                        colno: colno || 0,
                        stack: error && error.stack ? error.stack : ''
                    })
                }, self)
                
                // 调用原始的 onerror（如果存在）
                if (originalOnError) {
                    return originalOnError.apply(window, arguments)
                }
            }

            window.onerror = jsErrorHandler
            this.errorHandlers.push({ type: 'onerror', handler: jsErrorHandler, original: originalOnError })
        }

        // 2. Promise 未捕获错误监控
        if (this.config.enablePromiseError) {
            var promiseErrorHandler = function (event) {
                self.safeExecute(function () {
                    var reason = event.reason
                    var message = ''
                    var stack = ''

                    if (reason instanceof Error) {
                        message = reason.message
                        stack = reason.stack || ''
                    } else if (typeof reason === 'string') {
                        message = reason
                    } else {
                        try {
                            message = JSON.stringify(reason)
                        } catch (e) {
                            message = String(reason)
                        }
                    }
                    
                    self.reportError({
                        errorType: 'promise_error',
                        errorCategory: reason && reason.name ? reason.name : 'UnhandledRejection',
                        message: message || 'Promise rejection without reason',
                        filename: '',
                        lineno: 0,
                        colno: 0,
                        stack: stack
                    })
                }, self)
            }

            window.addEventListener('unhandledrejection', promiseErrorHandler)
            this.errorHandlers.push({ type: 'unhandledrejection', handler: promiseErrorHandler })
        }

        // 3. 资源加载错误监控 (捕获阶段) - 只在捕获阶段监听
        if (this.config.enableResourceError) {
            var resourceErrorHandler = function (event) {
                self.safeExecute(function () {
                    var target = event.target || event.srcElement
                    
                    // 只处理资源加载错误，排除 window 对象（JS 错误）
                    if (!target || target === window) {
                        return
                    }

                    var tagName = target.tagName ? target.tagName.toLowerCase() : ''
                    var resourceTypes = ['script', 'link', 'img', 'audio', 'video', 'iframe', 'source']
                    
                    if (resourceTypes.indexOf(tagName) === -1) {
                        return
                    }

                    var resourceUrl = target.src || target.href || ''
                    var resourceType = tagName

                    // CSS 特殊处理
                    if (tagName === 'link' && target.rel === 'stylesheet') {
                        resourceType = 'css'
                    }

                    self.reportError({
                        errorType: 'resource_error',
                        errorCategory: resourceType.toUpperCase() + '_LOAD_FAILED',
                        message: resourceType.toUpperCase() + ' 资源加载失败',
                        filename: resourceUrl,
                        resourceType: resourceType,
                        baseURI: target.baseURI || location.href,
                        outerHTML: target.outerHTML ? target.outerHTML.substring(0, 200) : '',
                        lineno: 0,
                        colno: 0,
                        stack: ''
                    })
                }, self)
            }

            // 使用捕获阶段监听，才能捕获到资源加载错误
            window.addEventListener('error', resourceErrorHandler, true)
            this.errorHandlers.push({ type: 'error', handler: resourceErrorHandler, capture: true })
        }
    }

    /**
     * 统一错误上报方法
     */
    PerformanceMonitorSDK.prototype.reportError = function (errorInfo) {
        this.safeExecute(function () {
            // 采样控制
            if (Math.random() > this.config.errorSampleRate) {
                return
            }

            // 错误数量限制
            if (this.errorCount >= this.config.maxErrorCount) {
                if (this.config.enableDebugLog && this.errorCount === this.config.maxErrorCount) {
                    console.warn('[' + this.config.appName + '] 错误上报已达上限：' + this.config.maxErrorCount)
                    this.errorCount++ // 只警告一次
                }
                return
            }

            // 错误去重：生成唯一key
            var errorKey = errorInfo.errorType + '|' + 
                           errorInfo.errorCategory + '|' + 
                           errorInfo.message + '|' + 
                           errorInfo.filename + '|' + 
                           errorInfo.lineno

            // 去重判断：同一错误只报一次，或者最多报5次
            if (this.errorCache[errorKey]) {
                this.errorCache[errorKey]++
                if (this.errorCache[errorKey] > 5) {
                    return
                }
            } else {
                this.errorCache[errorKey] = 1
            }

            // 统一上报格式
            var eventPos = 'PERFORMANCE.ERROR.' + errorInfo.errorType.toUpperCase() + '.EXPOSE.ERROR'
            var eventPosName = this.config.appNameCn + '-错误监控-' + errorInfo.errorType

            this.report({
                type: 'ERROR',
                eventPos: eventPos,
                eventPosName: eventPosName,
                eventCode: errorInfo.errorType + '_' + errorInfo.errorCategory.toLowerCase(),
                extendInfo: {
                    monitorType: 'error',
                    errorType: errorInfo.errorType, // js_error / promise_error / resource_error
                    errorCategory: errorInfo.errorCategory, // Error / TypeError / SCRIPT_LOAD_FAILED 等
                    errorMessage: errorInfo.message,
                    errorFilename: errorInfo.filename,
                    errorLineno: errorInfo.lineno,
                    errorColno: errorInfo.colno,
                    errorStack: errorInfo.stack ? errorInfo.stack.substring(0, 1000) : '', // 堆栈截断
                    resourceType: errorInfo.resourceType || '', // 仅资源错误有效
                    baseURI: errorInfo.baseURI || '',
                    outerHTML: errorInfo.outerHTML || '',
                    errorCount: this.errorCache[errorKey],
                    url: location.href,
                    referrer: document.referrer || '',
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                }
            })

            this.errorCount++

            if (this.config.enableDebugLog) {
                console.warn('[' + this.config.appName + '] 错误上报:', errorInfo)
            }
        }, this)
    }

    /**     * 动态更新全局扩展信息
     * @param {Object} newInfo - 要更新的全局信息对象
     */
    PerformanceMonitorSDK.prototype.updateGlobalInfo = function (newInfo) {
        this.safeExecute(function () {
            if (!newInfo || typeof newInfo !== 'object') {
                this.silentError('updateGlobalInfo: 参数必须是对象')
                return
            }

            // 合并新的全局信息
            for (var key in newInfo) {
                if (newInfo.hasOwnProperty(key)) {
                    this.config.extendGlobalInfo[key] = newInfo[key]
                }
            }

            // 调试模式下输出日志
            if (this.config.enableDebugLog) {
                console.log('[' + this.config.appName + '] 全局扩展信息已更新：', this.config.extendGlobalInfo)
            }
        }, this)
    }

    /**     * 上报事件
     */
    PerformanceMonitorSDK.prototype.report = function (event) {
        this.safeExecute(function () {
            event.timestamp = event.timestamp || Date.now()
            this.reportQueue.push(event)

            var self = this
            if (this.reportQueue.length >= this.config.batchSize) {
                this.flush()
            } else if (!this.timer) {
                this.timer = setTimeout(function () {
                    self.safeExecute(self.flush, self)
                }, this.config.reportDelay)
            }
        }, this)
    }

    /**
     * 立即上报
     */
    PerformanceMonitorSDK.prototype.flush = function () {
        this.safeExecute(function () {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }

            if (this.reportQueue.length === 0) {
                return
            }

            var events = this.reportQueue.splice(0)
            var payload = this.buildReportPayload(events)
            this.sendReport(payload)
        }, this)
    }

    /**
     * 构造上报数据
     */
    PerformanceMonitorSDK.prototype.buildReportPayload = function (events) {
        return this.safeExecute(function () {
            var deviceInfo = this.deviceInfo
            var config = this.config

            return {
                data: {
                    action: 'uploadWebDataSingleReport',
                    content: {
                        public: {
                            app_id: 'com.lexin.web',
                            ua: deviceInfo.ua,
                            device_system: deviceInfo.system,
                            device_system_version: deviceInfo.systemVersion,
                            screen_size: deviceInfo.screenSize
                        },
                        data: {
                            record_list: events.map(function (event) {
                                var extendInfo = {}
                                
                                // 1. 先合并事件本身的扩展信息
                                for (var key in event.extendInfo) {
                                    extendInfo[key] = event.extendInfo[key]
                                }
                                
                                // 2. 再合并配置中的全局扩展信息
                                for (var key in config.extendGlobalInfo) {
                                    extendInfo[key] = config.extendGlobalInfo[key]
                                }
                                
                                // 3. 最后添加用户信息（优先级最高,确保不被覆盖）
                                if (config.mid) {
                                    extendInfo.mid = config.mid
                                }
                                if (config.min) {
                                    extendInfo.min = config.min
                                }

                                return {
                                    record_type: 2,
                                    time: event.timestamp,
                                    page_name: '',
                                    event_pos: config.basePrefix + '.' + event.eventPos,
                                    event_pos_name: event.eventPosName,
                                    event_type: 2,
                                    isc: '',
                                    page_url: location.href,
                                    refer_url: document.referrer || '',
                                    extend_info: extendInfo,
                                    standard_extend_info: {
                                        event_pos_type: 'interaction'
                                    },
                                    event_case_code: config.basePrefix + '.' + event.eventPos,
                                    event_params: {
                                        flx_page: '',
                                        event_code: event.eventCode
                                    },
                                    report_source: 2,
                                    domain: location.hostname,
                                    page_type: /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent) ? 'h5' : 'h5',
                                    uid: config.mid || '',
                                    channel_extend_info: {},
                                    js_sdk_version: '1.0.0',
                                    business_params: {}
                                }
                            }),
                            app_log_type: 2
                        }
                    }
                }
            }
        }, this) || { data: { action: 'uploadWebDataSingleReport', content: { public: {}, data: { record_list: [] } } } }
    }

    /**
     * 发送上报
     */
    PerformanceMonitorSDK.prototype.sendReport = function (payload) {
        this.safeExecute(function () {
            var reportUrl = this.config.reportUrl
            var sdkName = this.config.appName

            if (!reportUrl) {
                this.silentError('上报地址未配置')
                return
            }

            // 优先使用 sendBeacon
            if (navigator.sendBeacon) {
                var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
                var success = navigator.sendBeacon(reportUrl, blob)
                if (success) {
                    if (this.config.enableDebugLog) {
                        console.log('[' + sdkName + '] sendBeacon 上报成功')
                    }
                    return
                }
            }

            // 降级到 fetch
            if (typeof fetch !== 'undefined') {
                var self = this
                fetch(reportUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                })
                .then(function () {
                    if (self.config.enableDebugLog) {
                        console.log('[' + sdkName + '] fetch 上报成功')
                    }
                })
                .catch(function (error) {
                    // 生产环境不输出错误
                })
            } else {
                // 降级到 XMLHttpRequest
                var xhr = new XMLHttpRequest()
                xhr.open('POST', reportUrl, true)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.send(JSON.stringify(payload))
            }
        }, this)
    }

    /**
     * 销毁
     */
    PerformanceMonitorSDK.prototype.destroy = function () {
        this.safeExecute(function () {
            this.flush()
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
            if (this.memoryCheckTimer) {
                clearInterval(this.memoryCheckTimer)
                this.memoryCheckTimer = null
            }
            
            // 移除错误监听器
            for (var i = 0; i < this.errorHandlers.length; i++) {
                var handler = this.errorHandlers[i]
                if (handler.type === 'onerror') {
                    // 恢复原始的 onerror
                    window.onerror = handler.original || null
                } else if (handler.capture) {
                    window.removeEventListener(handler.type, handler.handler, true)
                } else {
                    window.removeEventListener(handler.type, handler.handler)
                }
            }
            this.errorHandlers = []
        }, this)
    }

    // ============ 静态工具方法（供兜底脚本使用）============

    /**
     * 静态方法：9点采样法检测白屏
     * 可独立使用，不依赖 SDK 实例
     */
    PerformanceMonitorSDK.detectWhiteScreen = function () {
        var startTime = Date.now()
        try {
            var w = window.innerWidth
            var h = window.innerHeight
            var points = [
                [w * 0.25, h * 0.25], [w * 0.5, h * 0.25], [w * 0.75, h * 0.25],
                [w * 0.25, h * 0.5],  [w * 0.5, h * 0.5],  [w * 0.75, h * 0.5],
                [w * 0.25, h * 0.75], [w * 0.5, h * 0.75], [w * 0.75, h * 0.75]
            ]

            var emptyCount = 0
            for (var i = 0; i < points.length; i++) {
                var el = document.elementFromPoint(points[i][0], points[i][1])
                if (!el || el === document.documentElement || el === document.body) {
                    emptyCount++
                }
            }

            var isWhiteScreen = emptyCount >= points.length * 0.8

            return {
                isWhiteScreen: isWhiteScreen,
                reason: isWhiteScreen ? emptyCount + '/' + points.length + ' 采样点为空白' : undefined,
                duration: Date.now() - startTime,
                emptyPoints: emptyCount,
                totalPoints: points.length
            }
        } catch (error) {
            return {
                isWhiteScreen: false,
                reason: '检测异常: ' + error.message,
                duration: Date.now() - startTime
            }
        }
    }

    /**
     * 静态方法：获取设备信息
     * 可独立使用，不依赖 SDK 实例
     */
    PerformanceMonitorSDK.getDeviceInfo = function () {
        var ua = navigator.userAgent
        var system = 'Unknown'
        var systemVersion = ''

        if (ua.indexOf('Mac OS') > -1) {
            system = 'Mac OS'
            var match = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
            if (match) systemVersion = match[1].replace(/_/g, '.')
        } else if (ua.indexOf('Windows') > -1) {
            system = 'Windows'
            var match = ua.match(/Windows NT (\d+\.\d+)/)
            if (match) systemVersion = match[1]
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
            system = 'iOS'
            var match = ua.match(/OS (\d+[._]\d+)/)
            if (match) systemVersion = match[1].replace(/_/g, '.')
        } else if (ua.indexOf('Android') > -1) {
            system = 'Android'
            var match = ua.match(/Android (\d+\.\d+)/)
            if (match) systemVersion = match[1]
        } else if (ua.indexOf('Linux') > -1) {
            system = 'Linux'
        }

        return {
            system: system,
            systemVersion: systemVersion,
            screenSize: window.screen.width + '*' + window.screen.height,
            ua: ua
        }
    }

    /**
     * 静态方法：构造兜底白屏上报数据
     * 专门给兜底脚本使用，格式固定
     */
    PerformanceMonitorSDK.buildFallbackPayload = function (reason, startTime, basePrefix) {
        var now = Date.now()
        var deviceInfo = PerformanceMonitorSDK.getDeviceInfo()
        var currentTime = new Date(now).toISOString().slice(0, 19).replace('T', ' ')
        var prefix = basePrefix || 'APP'
        
        return {
            data: {
                action: 'uploadWebDataSingleReport',
                content: {
                    public: {
                        app_id: 'com.lexin.web',
                        ua: deviceInfo.ua,
                        device_system: deviceInfo.system,
                        device_system_version: deviceInfo.systemVersion,
                        screen_size: deviceInfo.screenSize
                    },
                    data: {
                        record_list: [{
                            record_type: 2,
                            time: now,
                            page_name: '',
                            event_pos: prefix + '.PERFORMANCE.WHITE_SCREEN_FALLBACK.EXPOSE.ERROR',
                            event_pos_name: '白屏监控(兜底)',
                            event_type: 2,
                            isc: '',
                            page_url: location.href,
                            refer_url: document.referrer || '',
                            extend_info: {
                                monitorType: 'white_screen',
                                isWhiteScreen: true,
                                reason: reason,
                                detectionDuration: now - (startTime || now),
                                url: location.href,
                                referrer: document.referrer || '',
                                timestamp: now
                            },
                            standard_extend_info: {
                                event_pos_type: 'interaction'
                            },
                            event_case_code: prefix + '.PERFORMANCE.WHITE_SCREEN_FALLBACK.EXPOSE.ERROR',
                            event_params: {
                                flx_page: '',
                                event_code: 'white_screen_error'
                            },
                            report_source: 2,
                            domain: location.hostname,
                            page_type: 'h5',
                            uid: '',
                            channel_extend_info: {},
                            js_sdk_version: '1.0.0',
                            business_params: {}
                        }],
                        app_log_type: 2
                    }
                }
            }
        }
    }

    /**
     * 静态方法：直接上报（兜底场景使用）
     * 不依赖 SDK 实例，直接发送数据
     */
    PerformanceMonitorSDK.sendReport = function (payload, reportUrl) {
        if (!reportUrl) {
            console.warn('[PerformanceMonitorSDK] 上报地址未配置')
            return
        }

        // 优先使用 sendBeacon
        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
            var success = navigator.sendBeacon(reportUrl, blob)
            console.log('[PerformanceMonitorSDK] sendBeacon 上报' + (success ? '成功' : '失败'))
            return
        }

        // 降级到 fetch
        if (typeof fetch !== 'undefined') {
            fetch(reportUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            })
                .then(function () {
                    console.log('[PerformanceMonitorSDK] fetch 上报成功')
                })
                .catch(function (error) {
                    console.error('[PerformanceMonitorSDK] 上报失败', error)
                })
        } else {
            // 降级到 XMLHttpRequest
            var xhr = new XMLHttpRequest()
            xhr.open('POST', reportUrl, true)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(payload))
        }
    }

    /**
     * 静态方法：兜底白屏上报（一站式接口）
     * 供兜底脚本调用，整合检测 + 构造 + 上报
     */
    PerformanceMonitorSDK.reportFallbackWhiteScreen = function (reason, startTime, config) {
        config = config || {}
        var basePrefix = config.basePrefix || 'APP'
        var reportUrl = config.reportUrl || ''

        console.log(
            '%c[白屏监控-兜底] 检测到白屏! 原因: ' + reason,
            'color: #ff4d4f; font-weight: bold; font-size: 14px;'
        )

        // 优先使用 GlobalDataReport（如果主包已加载）
        if (typeof GlobalDataReport === 'function') {
            try {
                GlobalDataReport({
                    eventPos: 'PERFORMANCE.WHITE_SCREEN_FALLBACK.EXPOSE.ERROR',
                    eventPosName: '白屏监控(兜底)',
                    extendInfo: {
                        monitorType: 'white_screen',
                        isWhiteScreen: true,
                        reason: reason,
                        detectionDuration: Date.now() - (startTime || Date.now()),
                        url: location.href,
                        referrer: document.referrer || '',
                        timestamp: Date.now()
                    }
                })
                console.log('[白屏监控-兜底] 使用 GlobalDataReport 上报成功')
                return
            } catch (e) {
                console.warn('[白屏监控-兜底] GlobalDataReport 上报失败，降级到 sendBeacon', e)
            }
        }

        // 降级方案：直接构造数据上报
        var payload = PerformanceMonitorSDK.buildFallbackPayload(reason, startTime, basePrefix)
        PerformanceMonitorSDK.sendReport(payload, reportUrl)
    }

    // 暴露到全局
    window.PerformanceMonitorSDK = PerformanceMonitorSDK

})(window)
