const configs = require('./core/configs')

module.exports = {
    complie: require('./core/compile'),
    renderTemplate: require('./core/renderTemplate'),
    setConfig: (key, value) => {
        if (Object.prototype.toString.call(key) === "[object Object]") { // 统一配置
            Object.assign(configs, key)
        } else { // 单一配置
            configs[key] = value
        }
    }
}