const multer = require("multer")
const path = require("path")

const imageStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        let folder = ''
        const url = request.originalUrl.toLowerCase()
        if(url.startsWith("/user")) {
            folder = 'users'
        } else if (url.startsWith("/pet")) {
            folder = 'pets'
        }
        callback(null, `public/images/${folder}`)
    },
    filename: function (request, file, callback) {
        callback(null, Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(request, file, callback) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error('Só aceito extensão jpg ou png'))
        }
        callback(undefined, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = imageUpload
