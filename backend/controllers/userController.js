const User = require("../models/User")
const bcrypt = require("bcrypt")
const userToken = require("../utils/userToken")
const getToken = require("../utils/getToken")
const jwt = require("jsonwebtoken")
const getUserByToken = require("../utils/getUserByToken")
require('dotenv').config({ path: '../.env' })

class UserController {
    async register(request, response) {
        const {name, email, password, confirm_password, photo, phone} = request.body

        if(!name) {
            response.status(422).json({status: false, message: "Nome obrigatório."})
            return 
        }

        if(!email) {
            response.status(422).json({status: false, message: "Email obrigatório."})
            return 
        }

        if(!password) {
            response.status(422).json({status: false, message: "Senha obrigatório."})
            return 
        }

        if(!confirm_password) {
            response.status(422).json({status: false, message: "Confirmação de senha obrigatório."})
            return 
        }

        if(!phone) {
            response.status(422).json({status: false, message: "Telefone obrigatório."})
            return 
        }

        
        if(password !== confirm_password) {
            response.status(422).json({status: false, message: "Senhas precisam serem iguais."})
            return 
        }

        var emailExists = await User.emailExists(email)
        if(emailExists) {
            response.status(422).json({status: false, message: "Email já existe."})
            return 
        }
        
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        try {
            const done = await User.save(name, email, passwordHash, photo, phone)
            if(!done) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar usuário."})
            }
            else {
                const user = await User.findByEmail(email) 
                if(!user) {
                    return response.status(400).json({status: false, message: "Erro ao criar token para usuário."})
                }
                else {
                    // criar token
                    return await userToken(user, request, response)
                }
            }

        } catch(err) {
            return response.status(500).json({status: false, message: err.message})
        }
    }

    async login(request, response) {
        const {email, password} = request.body
        if(!email) {
            response.status(422).json({status: false, message: "Email obrigatório."})
            return 
        } 
        if(!password) {
            response.status(422).json({status: false, message: "Senha obrigatório."})
            return 
        }
        const user = await User.findByEmail(email)
        if(!user) {
            return response.status(404).json({status: false, message: "Email não encontrado."})
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) {
            response.status(422).json({status: false, message: "Senha incorreta."})
            return 
        } 
        // done
        return await userToken(user, request, response)
    }

    async checkUser(request, response) {
        let currentUser
        //console.log(request.headers.authorization)
        if(request.headers.authorization) {
            const token = getToken(request)
            const decoded = jwt.verify(token, process.env.SECRET)
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        }
        else {
            currentUser = null
        }

        response.status(200).send(currentUser)
    }

    async getUserById(request, response) {
        const id = request.params.id
        if(!id || isNaN(id)) {
            return response.status(400).json({status: false, message: "Usuário invalido."})
        }
        var user = await User.findById(id)
        if(!user) {
            return response.status(404).json({status: false, message: "Usuário não encontrado."})
        }
        response.status(200).json({status: true, user})
    }

    async editUser(request, response) {
        var update = {}
        const id = request.params.id 
        if(!id || isNaN(id)) {
            return response.status(400).json({status: false, message: "Usuário invalido."})
        }
        const {name, email, phone} = request.body
        if(!name) {
            response.status(422).json({status: false, message: "Nome obrigatório."})
            return 
        }
        update.name = name

        if(!email) {
            response.status(422).json({status: false, message: "Email obrigatório."})
            return 
        }
        update.email = email

        if(!phone) {
            response.status(422).json({status: false, message: "Telefone obrigatório."})
            return 
        }
        update.phone = phone

        const token = getToken(request)
        const user = await getUserByToken(token)

        if (!user) {
            return response.status(404).json({status: false, message: "Usuário não encontrado."})
        }

        if (parseInt(id) !== user.id) {
            return response.status(403).json({
                status: false,
                message: "Operação não permitida. Token não corresponde."
            })
        }

        const emailExists = await User.emailExists(email)

        if(user.email !== email && emailExists) {
            response.status(422).json({status: false, message: "Email já existe."})
            return 
        }

        try {
            var done = await User.update(id, update)
            if(!done) {
                return response.status(422).json({status: false, message: "Erro ao atualizar usuário."}) 
            }
            return response.status(200).json({status: true, message: "Dados atualizados com sucesso."})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }

    }
}

module.exports = new UserController()
