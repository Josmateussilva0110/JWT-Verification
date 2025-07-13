const jwt = require("jsonwebtoken")
const getToken = require("../utils/getToken")
require('dotenv').config({ path: '../.env' })

const checkToken = (request, response, next) => {
    if(!request.headers.authorization) {
        return response.status(401).json({status: false, message: "Acesso negado."})
    }
    const token = getToken(request)

    if(!token) {
        return response.status(401).json({status: false, message: "Acesso negado."})
    }

    try {
        var verified = jwt.verify(token, process.env.SECRET)
        request.user = verified
        next()
    } catch(err) {
        return response.status(400).json({status: false, message: "Token invalido."})
    }
}

module.exports = checkToken
