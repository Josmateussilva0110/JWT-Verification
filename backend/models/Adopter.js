const knex = require("../database/connection")


class Adopter {
    async hasAdopter(pet_id, user_id) {
        try {
            var result = await knex.select(["pet_id"]).where({pet_id}).andWhere({user_id}).table('adopters')
            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar adotante', err)
            return false
        }
    }

    async save(pet_id, user_id) {
        try {
            await knex.insert({pet_id, user_id}).table("adopters")
            return true
        } catch(err) {
            console.log('erro ao agendar uma visita.', err)
            return false
        }
    }

    async adopted(pet_id) {
        var updated_at = knex.fn.now()
        try {
            await knex("adopters").where({pet_id}).update({status: 2, updated_at})
            return true
        } catch(err) {
            console.log('erro ao concluir agendamento.', err)
            return false
        }
    }

}

module.exports = new Adopter()
