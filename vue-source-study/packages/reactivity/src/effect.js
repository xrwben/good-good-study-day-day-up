
let activeEffect = null
function effect (effects) {
	activeEffect = effects
	effects()
	activeEffect = null
}

function reactive (obj) {
    return new Proxy(obj, {
        get (target, property, receiver) {
            // console.log('get>>>', property)
            track(target, property)
            return target[property]
        },
        set (target, property, value, receiver) {
            target[property] = value
        	trigger(target, property)
        	return true
        }
    })
}


const targetMap = new WeakMap()

function track (target, property) {
	if (!activeEffect) {
		return
	}
	// console.log(target, property)
	console.log(property, activeEffect)
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMap.set(target, depsMap)
	}
	let dep = depsMap.get(property)
	if (!dep) {
		dep = new Set()
		depsMap.set(property, dep)
	}
	dep.add(activeEffect)
	// console.log(targetMap)
}

function trigger (target, property) {
	// console.log(targetMap)
	const depsMap = targetMap.get(target)
	if (!depsMap) {
		return
	}
	const dep = depsMap.get(property)
	if (!dep) {
		return
	}
	// console.log(dep)
	dep.forEach(fn => fn())
}


const state = reactive({
	count: 10,
	name: 'xixi'
})


effect(() => {
	// console.log('state count 值为：', state.count, state.name)
})

state.count = 20
state.name = 'GG'