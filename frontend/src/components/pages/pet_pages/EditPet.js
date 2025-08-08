import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import api from '../../../utils/api'
import PetForm from "../../form/PetForm"

function EditPet() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const {id} = useParams()

    // função executada ao abrir a pagina 
    useEffect(() => {
        api.get(`/pet/${id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            setPet(response.data.pet)
        })
    }, [token, id])

    async function updatePet(pet) {

    }

    return (
        <section>
            <h1>Editar Pet</h1>
            {pet.id && (
                <PetForm handleSubmit={updatePet} petData={pet} flag="Atualizar">


                </PetForm>

            )}
        </section>
    )
}

export default EditPet
