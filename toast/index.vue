<template>
  <Teleport :to="teleport" :disabled="false">
    <Transition name="fade">
      <div v-show="show" :class="['toast', { 'loading': type === 'loading' }]">
        <slot>
          <div class="toast-icon" v-if="type === 'loading'">
            <svg class="loading-icon" viewBox="25 25 50 50">
              <circle cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke="#ffffff" stroke-dasharray="100" stroke-dashoffset="0"></circle>
            </svg>
          </div>
          <div class="toast-text">{{ message }}</div>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { watch, onUnmounted } from 'vue'
import { lockClick } from './utils'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000
  },
  icon: {
    type: String,
    default: ''
  },
  teleport: {
    type: String,
    default: 'body'
  },
  forbidClick: {
    type: Boolean,
    default: false
  }
})

console.log('props>>>>>>', props)

const emit = defineEmits(['update:show'])

let timer: number | null = null

// 监听是否显示变化
watch(() => props.show, () => {
  if (props.show && props.duration) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      emit('update:show', false)
    }, props.duration)
  }
  // 禁止点击控制
  const clickable = props.show && props.forbidClick
  lockClick(clickable)
}, { immediate: true })


onUnmounted(() => {
  timer && clearTimeout(timer)
  lockClick(false)
})

</script>

<style lang="less" scoped>
.toast {
  width: fit-content;
  min-width: 88px;
  max-width: 70%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 18px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  transform: translate(0, -50%);
  z-index: 999;
  margin: 0 auto;
  &.loading {
    width: 88px;
    height: 88px;
    padding: 16px;
  }
  .toast-icon {
    width: 30px;
    height: 30px;
    color: #fff;
    margin-bottom: 8px;
    animation: animation-loading 2s linear infinite;
    .loading-icon circle {
      animation: animation-circular 1.5s ease-in-out infinite;
    }
  }
}
// 全局样式添加到body上
:global(.forbid-click) {
  pointer-events: none;
  overflow: hidden;
  cursor: not-allowed;
}
@keyframes animation-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animation-circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
</style>