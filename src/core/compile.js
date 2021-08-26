const cache = require('./Cache')
const md5 = require('md5')
const configs = require('./configs')

const compile = (str, data, opts = {}) => {

    let cacheRenderFn = undefined
    let cacheId = md5(str) + opts.cacheId
    let useCache = opts.useCache || configs.useCache

    //判断缓存
    if (useCache) {
        cacheRenderFn = cache.getCache(cacheId)
    }

    if (cacheRenderFn) { // 缓存过，不知有没有返回结果，
        // console.log('使用缓存的函数')
        return (prop) => cacheRenderFn(prop || data)
    } else {
        let resStr = str

        resStr = "let str = '' \r\n ;with(data){\r\nstr+=\n`\n" + resStr

        resStr = resStr.replace(/<%=(.*?)%>/g, (target, match) => {
            return "\n${" + match + "}\n"
        })

        resStr = resStr.replace(/<%(.*?)%>/g, (target, match) => {
            return "\n`;\n" + match + "\r\n ;str += `\n"
        })
        resStr += "\n`;} \r\n ;return str ;\n"

        const fn = new Function("data", resStr)

        let render = (prop) => fn(prop || data)

        if (useCache) {
            // console.log('不走缓存，直接编译得到结果，并缓存结果')
            cache.setCache(cacheId, render)
        } else {
            // console.log('不走缓存，直接编译得到结果，不缓存结果')
        }

        return render
    }


}

module.exports = compile
