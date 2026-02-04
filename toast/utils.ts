// 点击锁定
export const lockClick = (lock: boolean) => {
  if (lock) {
    // document.body.style.pointerEvents = 'none'
    // document.body.style.overflow = 'hidden'
    // document.body.style.cursor = 'not-allowed'
    document.body.classList.add('forbid-click')
  } else {
    // document.body.style.pointerEvents = ''
    // document.body.style.overflow = ''
    // document.body.style.cursor = ''
    document.body.classList.remove('forbid-click')
  }
}