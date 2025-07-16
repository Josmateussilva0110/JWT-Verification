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

    async save(name, age, weight, color, user_id) {
        try {
            await knex.insert({name, age, weight, color, user_id}).table("pets")
            return true
        } catch(err) {
            console.log('erro ao cadastrar pet', err)
            return false
        }
    }
}

module.exports = new Pet()
