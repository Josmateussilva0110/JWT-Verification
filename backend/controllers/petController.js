const Pet = require("../models/Pet")
const FieldValidator = require("../utils/petValidator")
const userToken = require("../utils/userToken")
const getUserByToken = require("../utils/getUserByToken")
const getToken = require("../utils/getToken")


class PetController {
    async register(request, response) {
        const {name, age, weight, color} = request.body
        const error = FieldValidator.validate({
            name,
            age,
            weight,
            color
        })

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        const token = getToken(request)
        const user = await getUserByToken(token)

        if (!user) {
            return response.status(404).json({status: false, message: "Usuário não encontrado."})
        }

        const petExist = await Pet.petExist(name, user.id)
        if(petExist) {
            return response.status(422).json({status: false, message: "Nome de para esse pet ja existe."})
        }

        try {
            var done = await Pet.save(name, age, weight, color, user.id)
            if(!done) {
                return response.status(422).json({status: false, message: "Erro ao cadastrar pet."}) 
            }
            return response.status(200).json({status: true, message: "Cadastro realizado com sucesso."})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }
}

module.exports = new PetController()
