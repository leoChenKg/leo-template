const EventEmitter = require('events')

class Cache extends EventEmitter {
    constructor() {
        super()
        this.cache = {}
    }


    getCache(id) {
        return this.cache[id]
    }

    setCache(id, value) {
        this.cache[id] = value
    }

    setCacheWithEmit(id, value, eventType) {
        this.emit(eventType, value)
        this.cache[id] = value
    }
}


module.exports = new Cache()