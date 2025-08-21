import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import PetForm from "../../form/PetForm"
import useFlashMessage from '../../../hooks/useFlashMessage'
import requestData from "../../../utils/requestApi"

function EditPet() {
    const [pet, setPet] = useState({})
    const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
    const {id} = useParams()
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    // função executada ao abrir a pagina 
    useEffect(() => {
        async function fetchPet() {
            const response = await requestData(`/pet/${id}`, 'GET', null, token)
            if(response.success) {
                setPet(response.data.pet)
            }
        }
        if(token) {
            fetchPet()
        }
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

        const response = await requestData(`/pet/edit/${id}`, 'PATCH', formData, token)
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
        <section>
            {pet.id && (
                <PetForm handleSubmit={updatePet} petData={pet} title="Editar Pet"  flag="Atualizar">


                </PetForm>

            )}
        </section>
    )
}

export default EditPet
