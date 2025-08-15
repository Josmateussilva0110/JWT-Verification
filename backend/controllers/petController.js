const Pet = require("../models/Pet")
const Adopter = require("../models/Adopter")
const FieldValidator = require("../utils/petValidator")
const getTokenAndUser = require("../utils/getUserAndToken")


class PetController {
    async register(request, response) {
        const {name, age, weight, color} = request.body
        let photos = request.files

        //console.log(photos)
        //var id_user = request.user.id 

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

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        const {user} = result

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

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        const {user} = result

        if (parseInt(user_id) !== user.id) {
            return response.status(403).json({
                status: false,
                message: "Operação não permitida. Token não corresponde."
            })
        }

        try {
            var pets = await Pet.getPetByIdUser(user_id)
            if(!pets) {
                return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
            }
            return response.status(200).json({status: true, pets})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }

    async getPetByIdPet(request, response) {
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
            var pet = await Pet.getPetById(id)
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

        var pet = await Pet.getPetById(id)
        if(!pet) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
        }

        // pegar id do usuário
        //var id_user = request.user.id 
        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }

        const {user} = result
        if(pet.user_id !== user.id) {
            return response.status(403).json({ status: false, message: "Você não tem permissão para excluir este pet." })
        }

        try {
            var done = await Pet.remove(id)
            if(!done) {
                return response.status(500).json({ err: "Erro interno ao excluir pet."})
            }
            return response.status(200).json({status: true, message: "Pet removido com sucesso."})
        } catch(err) {
           return response.status(500).json({ err: "Erro interno ao excluir pet."})
        }
    }

    async edit(request, response) {
        const id = request.params.id 
        const {name, age, weight, color} = request.body
        let photos = request.files

        var error = FieldValidator.validate({
            id,
            name, 
            age,
            weight,
            color,
            photos
        }, true)

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }
        var pet = await Pet.getPetById(id)
        if(!pet) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
        }

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        const {user} = result
        if(pet.user_id !== user.id) {
            return response.status(403).json({ status: false, message: "Você não tem permissão para editar este pet." })
        }

        var update = {}
        update.name = name
        update.age = age
        update.weight = weight
        update.color = color

        if (photos && photos.length > 0) {
            const photoFilenames = photos.map(image => image.filename)
            update.photos = photoFilenames
        }


        try {
            var done = await Pet.update(id, update)
            if(!done) {
                return response.status(500).json({ err: "Erro ao editar pet."})
            }
            return response.status(200).json({status: true, message: "Pet editado com sucesso."})
        } catch(err) {
           return response.status(500).json({ err: "Erro interno ao editar pet."})
        }

    }

    async schedule(request, response) {
        const id = request.params.pet_id
        var error = FieldValidator.validate({
            id
        })
        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        var pet = await Pet.getPetById(id) 
        if(!pet) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."})
        }

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        // const {token, user} = result
        const {user} = result

        if(pet.user_id === user.id) {
            return response.status(422).json({status: false, message: "Não pode agendar, Pet já pertence a você."})
        }

        var hasAdopter = await Adopter.hasAdopter(id, user.id)
        if(hasAdopter) {
            return response.status(422).json({status: false, message: "Pet já tem uma visita agendada."})
        }

        try {
            var done = await Adopter.save(id, user.id)
            if(!done) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar agenda para o pet."})
            }
            return response.status(200).json({status: true, message: "Visita agendada com sucesso."})

        } catch(err) {
            return response.status(500).json({ err: "Erro interno ao marcar agendamento pet."})
        }

    }

    async completeAdoption(request, response) {
        const id = request.params.pet_id
        var error = FieldValidator.validate({
            id
        })
        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        var pet = await Pet.getPetById(id) 
        if(!pet) {
            return response.status(404).json({status: false, message: "Nenhum pet encontrado."})
        }

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        const {user} = result
    
        if(pet.user_id === user.id) {
            return response.status(422).json({status: false, message: "Não pode concluir, Pet já pertence a você."})
        }

        try {
            var done = await Adopter.adopted(id)
            if(!done) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar agenda para o pet."})
            }
            return response.status(200).json({status: true, message: "Pet adotado com sucesso."})

        } catch(err) {
            return response.status(500).json({ err: "Erro interno ao marcar agendamento pet."})
        }
    }

    async schedules(request, response) {
        const {user_id} = request.params

       const error = FieldValidator.validate({
            id: user_id
        })

        if(error) {
            return response.status(422).json({ status: false, message: error })
        }

        const result = await getTokenAndUser(request)
        if(!result) {
            return response.status(401).json({status: false, message: "Usuário não autenticado."})
        }
        const {user} = result

        if (parseInt(user_id) !== user.id) {
            return response.status(403).json({
                status: false,
                message: "Operação não permitida. Token não corresponde."
            })
        }

        try {
            var pets = await Adopter.schedules(user_id)
            if(!pets) {
                return response.status(404).json({status: false, message: "Nenhum pet encontrado."}) 
            }
            return response.status(200).json({status: true, pets})
        } catch(err) {
            return response.status(500).json({status: false, message: err})
        }
    }
}

module.exports = new PetController()
