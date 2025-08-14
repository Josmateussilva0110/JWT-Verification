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
            var result = await knex.raw(`
                select p.*, 
                case 
                    when a.status = 2 then 'Adotado'
                    when a.status = 1 then 'Visita Agendada'
                    else 'Disponível'
                end as situation

                from pets p
                left join adopters a 
                    on p.id = a.pet_id
                order by p.updated_at desc;
            `)
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

    async getPetByIdUser(user_id) {
        try {
            var result = await knex.raw(`
                select p.*, 
                case 
                    when a.status = 2 then 'Adotado'
                    when a.status = 1 then 'Visita Agendada'
                    else 'Disponível'
                end as situation

                from pets p
                left join adopters a 
                    on p.id = a.pet_id
                where p.user_id = ? 
                order by p.updated_at desc
                
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

    async getPetById(id) {
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

    async update(id, update) {
        update.updated_at = knex.fn.now()
        try {
            // Remove valor undefined ou null
            Object.keys(update).forEach(key => {
                if (update[key] === undefined) {
                    delete update[key]
                }
            })
            await knex.table("pets").where({ id }).update(update)
            return true
        } catch(err) {
            console.log('erro em atualizar pet: ', err)
            return false
        }
    }

}

module.exports = new Pet()
