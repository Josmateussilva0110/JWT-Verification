const jwt = require("jsonwebtoken")
const User = require("../models/User")
require('dotenv').config({ path: '../.env' })


const getUserByToken = async (token) => {
    if(!token) {
        return 'Acesso negado.'
    }
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    const user = await User.findById(userId)
    return user
}

module.exports = getUserByToken
