export class Emitter {
    constructor () {
        this.eventCenter = new Map()
    }

    on (eventName, evnetFn) {
        if (!this.eventCenter.has(eventName)) {
            this.eventCenter.set(eventName, [])
        }
        this.eventCenter.get(eventName).push(evnetFn)
    }

    emit (eventName, data) {
        if (this.eventCenter.has(eventName)) {
            this.eventCenter.get(eventName).forEach((evnetFn) => {
                evnetFn(data)
            })
        }
    }
}

let activeEffect = null

export const effect = (effects) => {
    activeEffect = effects
    effects()
    activeEffect = null
}

const emitter = new Emitter()

export const reactive = (obj) => {
    return new Proxy(obj, {
        get (target, property, receiver) {
            // if (typeof target[property] === 'object') {
            //     return reactive(target[property])
            // }
            emitter.on(property, activeEffect)
            return target[property]
        },
        set (target, property, value, receiver) {
            target[property] = value
            return true
        }
    })
}


const state = reactive({
    count: 10
})

effect(() => {
    console.log('count值为：', state.count)
})