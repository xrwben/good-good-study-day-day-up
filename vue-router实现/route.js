class VueRouter {
	constructor (options) {
		this.mode = options.mode || 'hash'
        this.routes = options.routes || []
        
        this.routesMap = this.createMap(this.routes)
        console.log(this.routesMap)
        
        this.history = new HistoryRoute()

        this.init()

    }

    createMap (routes) {
        let routesMap = {}
        routes.forEach((item) => {
            routesMap[item.path] = item.component
        })
        return routesMap
    }
    
    init () {
        if (this.mode === 'hash') {
            location.hash ? '' : location.hash = "/";
            window.addEventListener("load", () => {
                this.history.current = location.hash.slice(1)
            })
            window.addEventListener("hashchange", () => {
                this.history.current = location.hash.slice(1)
            })
        } else {
            location.pathname ? '' : location.pathname = "/";
            window.addEventListener("load", () => {
                this.history.current = location.pathname
            })
            window.addEventListener("popstate", (e) => {
                console.log('popstate')
                e.preventDefault()
                this.history.current = location.pathname
            })
        }
    }
}

class HistoryRoute {
    constructor () {
        this.current = null
    }
}


VueRouter.install = function (Vue) {

    console.log("this>>>>", Vue.util.defineReactive, this.mode)

	Vue.mixin({
        beforeCreate () {
            // debugger
            if (this.$options && this.$options.router){ // 如果是根组件
                this._root = this; //把当前实例挂载到_root上
                this._router = this.$options.router;

                Vue.util.defineReactive(this, "_route", this._router.history)
            }else { //如果是子组件
                this._root= this.$parent && this.$parent._root
            }
            Object.defineProperty(this,'$router',{
                get () {
                    return this._root._router
                }
            })
            Object.defineProperty(this,'$route',{
                get () {
                    return this._root._router.history.current
                }
            })
        }
    })

	Vue.component("router-link", {
		render (h) {
            let to = this._self._root._router.mode === "hash" ? "#" + this.to : this.to
			return h('a', {
                attrs: {
                    href: to,
                }
            }, this.$slots.default)
        },
        props: {
            to: {
                type: String
            }
        }

	})

	Vue.component("router-view", {
		render (h) {
            let current = this._self._root._router.history.current
            let routesMap = this._self._root._router.routesMap
			return h(routesMap[current])
		}
	})

}

export default VueRouter;