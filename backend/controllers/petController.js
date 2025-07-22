const Pet = require("../models/Pet")
const FieldValidator = require("../utils/petValidator")
const userToken = require("../utils/userToken")
const getUserByToken = require("../utils/getUserByToken")
const getToken = require("../utils/getToken")


class PetController {
    async register(request, response) {
        const {name, age, weight, color} = request.body
        let photos = request.files

        //console.log(photos)

        const error = FieldValidator.validate({
            name,
            age,
            weight,
            color,
            photos
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
            return response.status(422).json({status: false, message: "Nome para esse pet ja existe."})
        }

        const photoFilenames = photos.map(image => image.filename)

        try {
            var done = await Pet.save(name, age, weight, color, photoFilenames, user.id)
            if(!done) {
                return response.status(422).json({status: false, message: "Erro ao cadastrar pet."}) 
            }
            return response.status(200).json({status: true, message: "Cadastro realizado com sucesso."})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }

    async getPets(request, response) {
        try {
            var pets = await Pet.getAll()
            if(!pets) {
                return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
            }
            return response.status(200).json({status: true, pets})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }
    
    async getPetsByUser(request, response) {

        const user_id = request.params.user_id

        const error = FieldValidator.validate({
            id: user_id
        })

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        const token = getToken(request)
        const user = await getUserByToken(token)

        if (!user) {
            return response.status(404).json({status: false, message: "Usuário não encontrado."})
        }

        if (parseInt(user_id) !== user.id) {
            return response.status(403).json({
                status: false,
                message: "Operação não permitida. Token não corresponde."
            })
        }

        try {
            var pets = await Pet.getPetsByIdUser(user_id)
            if(!pets) {
                return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
            }
            return response.status(200).json({status: true, pets})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }

    async getPetsByIdPet(request, response) {
        const id = request.params.id

        const error = FieldValidator.validate({
            id
        })

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        var petExist = await Pet.idPetExist(id)
        if(!petExist) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
        }

        try {
            var pet = await Pet.getPetsById(id)
            if(!pet) {
                return response.status(502).json({status: false, message: "Erro interno na busca do pet."}) 
            }
            return response.status(200).json({status: true, pet})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }

    async remove(request, response) {
        var id = request.params.id
        var error = FieldValidator.validate({
            id
        })

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        var pet = await Pet.getPetsById(id)
        if(!pet) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
        }

        // pegar id do usuário
        //var id_user = request.user.id 
        const token = getToken(request)
        // usuário logado
        const user = await getUserByToken(token)
        if(pet.user_id !== user.id) {
            return response.status(403).json({ status: false, message: "Você não tem permissão para excluir este pet." })
        }

        try {
            var done = await Pet.remove(id)
            if(!done) {
                return response.status(502).json({ err: "Erro interno ao excluir pet."})
            }
            return response.status(200).json({status: true, message: "Pet removido com sucesso."})
        } catch(err) {
           return response.status(500).json({ err: "Erro interno ao excluir pet."})
        }
    }
}

module.exports = new PetController()
