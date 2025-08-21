import styles from './Register.module.css'
import PetForm from '../../form/PetForm'
import useFlashMessage from '../../../hooks/useFlashMessage'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import requestData from '../../../utils/requestApi'

function RegisterPet() {
    const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
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

        const response = await requestData(`/pet/register`, 'POST', formData, token)
        if(response.success) {
            setFlashMessage(response.data.message, msgType)
        }
        else {
            msgType = 'error'
            setFlashMessage(response.message, msgType)
        }

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
