const { getContentBase } = require('../utils')

let configs = {
    contentBase: getContentBase() || undefined,
    useCache: false
}

module.exports = configs