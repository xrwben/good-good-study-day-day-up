import { createApp, reactive, h } from 'vue'
import Toast from './index.vue'

interface ToastProps {
  show?: boolean
  type?: 'text' | 'loading'
  message?: string
  duration?: number
  icon?: string
  teleport?: string
  forbidClick?: boolean,
  [key: string]: any
}

const defaultProps: ToastProps = {
  show: false,
  type: 'text',
  message: '',
  duration: 2000,
  icon: '',
  teleport: 'body',
  forbidClick: false
}

// 单例模式，只创建一个toast实例
let toastInstance: any = null

const toastState = reactive({
  show: false
})

const createInstance = (config: ToastProps) => {
  // 更新响应式状态
  Object.assign(toastState, defaultProps, config, { show: true })

  // 单例模式，只创建一个toast实例
  if (toastInstance) {
    return toastInstance
  }

  const app = createApp({
    render: () => h(Toast, {
      ...toastState,
      'onUpdate:show': (data) => {
        toastState.show = data
      }
    })
  })
  const div = document.createElement('div')
  const toast = app.mount(div)
  const { teleport } = config || defaultProps
  const target = document.querySelector(teleport || 'body')
  target && target.appendChild(div)

  const unmount = () => {
    app.unmount()
    div.parentNode?.removeChild(div)
    toastInstance = null
  }

  toastInstance = {
    instance: toast,
    close: () => {
      unmount()
    }
  }

  return toastInstance
}

export const showToast = (config: ToastProps) => {
  const { instance, close } = createInstance(config)
  instance.close = close
  return instance
}

export const showLoading = (config?: ToastProps) => {
  const { instance, close } = createInstance({
    type: 'loading',
    message: '加载中...',
    ...config
  })
  instance.close = close
  return instance
}