import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from '../../../utils/api'
import PetForm from "../../form/PetForm"
import useFlashMessage from '../../../hooks/useFlashMessage'

function EditPet() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const {id} = useParams()
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    // função executada ao abrir a pagina 
    useEffect(() => {
        api.get(`/pet/${id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            setPet(response.data.pet)
        })
    }, [token, id])

    async function updatePet(updatedPet) {
        const formData = new FormData()

        Object.keys(updatedPet).forEach((key) => {
            if (key === 'photos') {
                for (let i = 0; i < updatedPet[key].length; i++) {
                    formData.append('photos', updatedPet[key][i])
                }
            } else {
                formData.append(key, updatedPet[key])
            }
        })

        let msgType = 'success'
        let data

        try {
            const response = await api.patch(`/pet/edit/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            data = response.data
        } catch (err) {
            msgType = 'error'
            data = err.response?.data || { message: 'Erro ao editar pet.' }
        }

        setFlashMessage(data.message, msgType)

        if (msgType !== 'error') {
            navigate('/pet/myPets')
        }
    }

    return (
        <section>
            {pet.id && (
                <PetForm handleSubmit={updatePet} petData={pet} title="Editar Pet"  flag="Atualizar">


                </PetForm>

            )}
        </section>
    )
}

export default EditPet
