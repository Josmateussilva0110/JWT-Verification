const jwt = require("jsonwebtoken")
require('dotenv').config({ path: '../.env' })


const createToken = async (user, request, response) => {
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, process.env.SECRET)

    response.status(200).json({
        status: true,
        message: "Autenticação feita.",
        token,
        userId: user.id
    })
}

module.exports = createToken
