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
        console.log(folder)
        callback(null, `public/images/${folder}`)
    },
    filename: function (request, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(request, file, callback) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return callback(new Error('Só aceito extensão jpg ou png'))
        }
        callback(undefined, true)
    }
})

module.exports = imageUpload
