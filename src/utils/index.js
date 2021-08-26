const fs = require('fs')
module.exports = {
    readFile(filePath) {
        console.log('文件读取！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！')
        return new Promise((resolve, reject) => {
            let bufs = []
            const rs = fs.createReadStream(filePath)

            rs.on('data', (chunk) => {
                bufs.push(chunk)
            })

            rs.on('end', () => {
                resolve(Buffer.concat(bufs).toString())
            })

            rs.on('error', (err) => {
                reject(err)
            })
        })
    }
}