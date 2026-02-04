class EventBus {
	constructor (value) {
		this.eventCenter = new Map()
		this._value = value
	}

	get value () {
		return this._value
	}

	set value (newValue) {
		this._value = newValue
	}

	on (eventName, callback) {
		if (!this.eventCenter.has(eventName)) {
			this.eventCenter.set(eventName, [])
		}
		this.eventCenter.get(eventName).push(callback)
	}

	emit (eventName) {
		if (this.eventCenter.has(eventName)) {
			this.eventCenter.get(eventName).forEach((callback) => {
				callback()
			})
		}
	}

	off (eventName, callback) {
		if (!eventName) {
			this.eventCenter.clear()
		}
		if (eventName && !callback) {
			this.eventCenter.delete(eventName)
		}
		if (eventName && this.eventCenter.has(eventName)) {
			const events = this.eventCenter.get(eventName).filter(cb => cb != callback)
			this.eventCenter.set(eventName, events)
		}
	}
}

const eventBus = new EventBus(10)
let currentEffect = null

const effect = (effects) => {
	// currentEffect = effects
	eventBus.on(effects, effects)
	effects()
	// currentEffect = null
}

let b

effect(() => {
	b = eventBus.value + 10
	console.log(b)
})
eventBus.value = 20