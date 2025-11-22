window.onerror = (message, source, lineno, colno, error) => {
    console.log(message, source, lineno, colno, error)
}

window.addEventListener('error', e => {
    console.log(e)
})

window.addEventListener('unhandledrejection', e => {
    console.log('unhandledrejection', e)
})