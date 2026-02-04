// import { reactive, effect } from '@vue/reactivity'
import { reactive, effect, Emitter } from './packages/reactivity/index.js'

const state = reactive({
	name: 'dabenli',
	age: 0,
	skillTree: {
		html: 90,
		js: 80,
		css: 90
	}
})


// console.log(state.age)
// state.age++
// console.log(state.age)

// state.skillTree.html
// state.skillTree.weex = 60
// console.log(state.skillTree.weex)

const updateAge = () => {
	let realAge = state.age + 18
	console.log(realAge)
}

// const emitter = new Emitter()
// emitter.on('age', updateAge)
// emitter.emit('age')
// emitter.emit('age', state.age++)
// emitter.emit('age', state.age++)

effect(() => {
	updateAge()
})

// state.age++