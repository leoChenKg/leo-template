const fs = require('fs')
const path = require('path')
const cache = require('./Cache')
const compile = require('./compile')
const { readFile } = require('../utils')
const configs = require('./configs')

const ERRORS = {
    TEMPLATE_PATH_UNDEFINED: "Template path cannot be undefined!",
}

const renderTemplate = (tempPath, data = {}, opts = {}) => {
    if (!tempPath)
        throw ERRORS.TEMPLATE_PATH_UNDEFINED

    // 默认自己设置的路径，否则使用全局的 template 路径
    let basePath = opts.contentBase || configs.contentBase
    // 传入template的绝对路径，用于读取文件
    let resourcePath = path.resolve(basePath, tempPath)
    let useCache = opts.useCache || configs.useCache

    return new Promise(async (resovle, reject) => {
        let template = { id: resourcePath, value: "" }
        let cacheRenderFn = undefined

        if (useCache)
            cacheRenderFn = cache.getCache(template.id)

        // let cacheRenderFn = cache.getCache(template.id)
        if (cacheRenderFn && useCache) { // 缓存过，不知有没有返回结果，
            let resTempStr = cacheRenderFn(data) // 得到 cacheRenderFn 返回值，为空说明前一次操作没有完成，需要监听，前一次完成获取缓存
            if (resTempStr) {  // 有缓存直接抛出结果返回
                console.log('缓存：直接得到缓存值')
                resovle(resTempStr)
            } else { // 没有返回值，就直接 监听前一个的成功
                cache.once(template.id, (renderFn) => { // renderFn 为前一个处理成功后返回的模板生成函数
                    console.log('缓存：直接得到监听的缓存值')
                    resovle(renderFn(data))
                })
            }
        } else { // 没走过缓存，直接开始编译
            try {
                // 如果要缓存，缓存一个返回值为空的函数，
                // 由于每次操作是异步的，所以可能前一次的没处理完成，cacheRenderFn 函数没返回值
                useCache && cache.setCache(template.id, () => { })
                //得到初始的模板字符串
                let rawTemp = await readFile(resourcePath)
                // 解析模板
                let render = compile(rawTemp, data)
                resovle(render())
                console.log('不走缓存：直接编译获取')
                useCache && cache.setCacheWithEmit(template.id, render, template.id)

            } catch (err) {
                reject(err)
            }
        }

    })
}
module.exports = renderTemplate
