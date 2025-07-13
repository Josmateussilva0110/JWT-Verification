const knex = require("../database/connection")



class User {
    async emailExists(email) {
        try {
            var result = await knex.select(["email"]).where({email: email}).table("users")
            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro em buscar nome de email: ', err)
            return false
        }
    }

    async save(name, email, passwordHash, photo, phone) {
        try {
            await knex.insert({name, email, password: passwordHash, photo, phone}).table("users")
            return true
        } catch(err) {
            console.log('erro ao cadastrar usuário', err)
            return false
        }
    }

    async findByEmail(email) {
        try {
            var result = await knex.select("*").where({email: email}).table("users")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch(err) {
            console.log('erro em buscar usuário por email: ', err)
            return undefined
        }
    }

    async findById(id) {
        try {
            var result = await knex.select(["id", "name", "email", "phone", "photo", "created_at", "updated_at"]).where({id: id}).table("users")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch(err) {
            console.log('erro em buscar usuário por id: ', err)
            return undefined
        }
    }

    async update(id, update) {
        try {
            // Remove valor undefined ou null
            Object.keys(update).forEach(key => {
                if (update[key] === undefined) {
                    delete update[key]
                }
            })
            
            await knex.table("users").where({ id }).update(update)
            return true
        } catch(err) {
            console.log('erro em atualizar usuário: ', err)
            return false
        }
    }
}


module.exports = new User()
