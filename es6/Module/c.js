const name = 'daben'

const getName = () => {
    console.log("getName函数")
}

class WaterMark {
    constructor () {
        this.print()
    }
    print () {
        console.log("print print print")
    }
}

export { name, getName, WaterMark }