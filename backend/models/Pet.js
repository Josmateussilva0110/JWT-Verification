const knex = require("../database/connection")


class Pet {
    async petExist(name, user_id) {
        try {   
            var result = await knex.select(["name"]).where({name}).andWhere('user_id', user_id).table('pets')

            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro em busca de pet existe: ', err)
            return false
        }
    }

    async idPetExist(id) {
        try {   
            var result = await knex.select(["id"]).where({id}).table('pets')

            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro em busca de id pet: ', err)
            return false
        }
    }

    async save(name, age, weight, color, photos, user_id) {
        try {
            await knex.insert({name, age, weight, color, photos, user_id}).table("pets")
            return true
        } catch(err) {
            console.log('erro ao cadastrar pet', err)
            return false
        }
    }

    async getAll() {
        try {
            var result = await knex.select("*").table('pets') 
            if(result.length > 0) {
                return result
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar todos os pets', err)
            return false
        }
    }

    async getPetsByIdUser(user_id) {
        try {
            var result = await knex.select("*").where({user_id}).table('pets')
            if(result.length > 0) {
                return result
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar todos os pets', err)
            return false
        }
    }

    async getPetsById(id) {
        try {
            var result = await knex.select("*").where({id}).table('pets')
            if(result.length > 0) {
                return result[0]
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar todos os pets por id', err)
            return false
        }
    }

    async remove(id) {
        try {
            var result = await knex('pets').where({id}).del()
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

module.exports = new Pet()
