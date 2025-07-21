const validator = require('validator')

class PetFieldValidator {

    static name(name) {
        if (validator.isEmpty(name || '')) {
            return 'Nome do pet é obrigatório.'
        }
        if (!validator.isLength(name, { min: 3, max: 50 })) {
            return 'Nome do pet deve ter entre 3 e 50 caracteres.'
        }
        return null
    }

    static age(age) {
        if (validator.isEmpty(age + '')) { 
            return 'Idade do pet é obrigatória.'
        }
        if (!validator.isInt(age + '', { min: 0, max: 100 })) {
            return 'Idade inválida. Use um número entre 0 e 100.'
        }
        return null
    }

    static weight(weight) {
        if (validator.isEmpty(weight + '')) {
            return 'Peso do pet é obrigatório.'
        }
        if (!validator.isFloat(weight + '', { min: 0.1 })) {
            return 'Peso inválido. Use um número maior que 0.'
        }
        return null
    }

    static color(color) {
        if (validator.isEmpty(color || '')) {
            return 'Cor do pet é obrigatória.'
        }
        if (!validator.isLength(color, { min: 3, max: 30 })) {
            return 'Cor inválida. Use entre 3 e 30 caracteres.'
        }
        return null
    }

    static photos(photos) {
        if (!photos || photos.length === 0) {
            return 'Pelo menos uma foto do pet é obrigatória.'
        }

        const maxSizeInBytes = 5 * 1024 * 1024 // 5MB

        for (const photo of photos) {
            if (photo.size > maxSizeInBytes) {
                return `A imagem '${photo.originalname}' excede o tamanho máximo de 5MB.`
            }
        }

        return null
    }


    static id(id) {
        if (!validator.isInt(id + '', { min: 1 })) {
            return 'ID inválido.'
        }
        return null
    }

    static validate(fields) {
        for (const [field, value] of Object.entries(fields)) {
            let error = null

            switch (field) {
                case 'name':
                    error = PetFieldValidator.name(value)
                    break
                case 'age':
                    error = PetFieldValidator.age(value)
                    break
                case 'weight':
                    error = PetFieldValidator.weight(value)
                    break
                case 'photos':
                    error = PetFieldValidator.photos(value)
                    break
                case 'color':
                    error = PetFieldValidator.color(value)
                    break
                case 'id':
                    error = PetFieldValidator.id(value)
                    break
                default:
                    return `Validação para '${field}' não implementada.`
            }

            if (error) {
                return error
            }
        }

        return null // Sem erros
    }

}

module.exports = PetFieldValidator
