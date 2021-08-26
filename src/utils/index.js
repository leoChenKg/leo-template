const fs = require('fs')
const path = require('path')

module.exports = {
    readFile(filePath) {
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
    },
    getContentBase() {
        let base = process.cwd()

        const next = (p) => {
            let pathname = p.split("\\").slice(-1)[0]
            if ([
                "node_modules",
                ".git",
                ".gitignore",
                "README.MD",
                "package-lock.json",
                "package.json"
            ].includes(pathname)) return

            try {
                let statOuterObj = fs.statSync(p)
                if (statOuterObj.isDirectory()) {
                    if (pathname === "template") {
                        return p
                    } else {
                        let dirs = fs.readdirSync(p)
                        for (let i = 0; i < dirs.length; i++) {
                            let res = next(path.join(p, dirs[i]))
                            if (res) return res
                        }
                    }
                }
            } catch (error) { }
        }

        return next(base)
    }
}