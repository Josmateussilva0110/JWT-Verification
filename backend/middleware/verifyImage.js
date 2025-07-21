const multer = require("multer")

const checkImage = (err, request, response, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return response.status(422).json({ status: false, message: 'Arquivo muito grande. Máximo 5MB por imagem.' })
        }
        return response.status(422).json({ status: false, message: err.message })
    }

    if (err) {
        return response.status(500).json({ status: false, message: 'Erro interno do servidor.' })
    }

    next()
}

module.exports = checkImage
