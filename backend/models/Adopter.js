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

    async schedules(user_id) {
        try {
            var result = await knex.raw(`
                select p.* from pets p 
                inner join adopters a 
                    on a.pet_id = p.id
                where a.status = 1 and a.user_id = ?
                order by a.updated_at desc;
                
            `,[user_id])
            const pets = result.rows
            if(pets.length > 0) {
                return pets
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar todos os pets', err)
            return false
        }
    }

    async remove(id) {
        try {
            var result = await knex('adopters').where({pet_id: id}).del()
            if(result > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao remover pet: ', err)
            return false
        }
    }

}

module.exports = new Adopter()
