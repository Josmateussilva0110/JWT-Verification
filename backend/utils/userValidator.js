const validator = require('validator')

class UserFieldValidator {

    static name(name) {
        if (validator.isEmpty(name || '')) {
            return 'Nome obrigatório.'
        }
        if (!validator.isLength(name, { min: 3, max: 50 })) {
            return 'Nome deve ter entre 3 e 50 caracteres.'
        }
        return null
    }

    static email(email) {
        if (validator.isEmpty(email || '')) {
            return 'Email obrigatório.'
        }
        if (!validator.isEmail(email)) {
            return 'Email inválido.'
        }
        return null
    }

    static password(password) {
        if (validator.isEmpty(password || '')) {
            return 'Senha obrigatória.'
        }
        if (!validator.isLength(password, { min: 6 })) {
            return 'Senha deve ter no mínimo 6 caracteres.'
        }
        return null
    }

    static phone(phone) {
        if (validator.isEmpty(phone || '')) {
            return 'Telefone obrigatório.'
        }
        if (!validator.isNumeric(phone) || (phone.length < 10 || phone.length > 11)) {
            return 'Telefone inválido. Use apenas números com 10 ou 11 dígitos.'
        }
        return null
    }

    static confirmPassword(password, confirm_password) {
        if (validator.isEmpty(confirm_password || '')) {
            return 'Confirmação de senha obrigatória.'
        }
        if (password !== confirm_password) {
            return 'Senhas precisam ser iguais.'
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
                    error = UserFieldValidator.name(value)
                    break
                case 'email':
                    error = UserFieldValidator.email(value)
                    break
                case 'password':
                    error = UserFieldValidator.password(value)
                    break
                case 'confirm_password':
                    error = UserFieldValidator.confirmPassword(fields.password, value)
                    break
                case 'phone':
                    error = UserFieldValidator.phone(value)
                    break
                case 'id':
                    error = UserFieldValidator.id(value)
                    break
                default:
                    return `Validação para '${field}' não implementada.`
            }

            if (error) {
                return error
            }
        }

        return null // sem erros
    }

}

module.exports = UserFieldValidator
