import styles from './Register.module.css'
import PetForm from '../../form/PetForm'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function RegisterPet() {
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function addPet(pet) {
        const formData = new FormData()

        Object.keys(pet).forEach((key) => {
            if (key === 'photos') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('photos', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        let msgType = 'success'
        let data

        //console.log(formData)

        try {
            const response = await api.post('/pet/register', formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            data = response.data
        } catch (err) {
            msgType = 'error'
            data = err.response?.data || { message: 'Erro ao cadastrar pet.' }
        }

        setFlashMessage(data.message, msgType)

        if (msgType !== 'error') {
            navigate('/pet/myPets')
        }
    }

    return (
        <section className={styles.addpet_header}>
            <PetForm handleSubmit={addPet} title="Cadastrar Pet" flag="Cadastrar" />
        </section>
    )
}

export default RegisterPet
