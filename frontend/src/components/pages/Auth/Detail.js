import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from './Detail.module.css'
import requestData from "../../../utils/requestApi"

function Detail() {
    const [pet, setPet] = useState({})
    const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()
    const location = useLocation()
    const flag = location.state?.flag


    useEffect(() => {
        let msgType = 'success'
        async function fetchPet() {
            const response = await requestData(`/pet/${id}`, 'GET', null, token)
            if(response.success) {
                setPet(response.data.pet)
            }
            else {
                msgType = 'error'
                setFlashMessage(response.message, msgType)
            }
        }

        if(msgType !== 'error') {
            fetchPet()
        }        
    }, [token, id])

    async function schedulePet() {
        const token = JSON.parse(localStorage.getItem('token'))
        if (!token) {
            setFlashMessage('Você precisa estar logado para fazer essa operação.', 'error')
            return
        }
        let msgType = 'success'

        const response = await requestData(`/pet/schedule/${id}`, 'POST', null, token)
        if(response.success) {
            setFlashMessage(response.data.message, msgType)
            navigate('/')
        }
        else {
            msgType = 'error'
            setFlashMessage(response.message, msgType)
        }
    }

    async function completeAdopt() {
        const token = JSON.parse(localStorage.getItem('token'))
        if (!token) {
            setFlashMessage('Você precisa estar logado para fazer essa operação.', 'error')
            return
        }
        let msgType = 'success'
        
        const response = await requestData(`/pet/complete/schedule/${id}`, "PATCH", null, token)
        if(response.success) {
            setFlashMessage(response.data.message, msgType)
            navigate('/pet/schedules')
        }
        else {
            msgType = 'error'
            setFlashMessage(response.message, msgType)
        }
    }

    async function removeSchedule() {
        const token = JSON.parse(localStorage.getItem('token'))
        if (!token) {
            setFlashMessage('Você precisa estar logado para fazer essa op.', 'error')
            return
        }

        let msgType = 'success'
        const response = await requestData(`/pet/schedule/remove/${id}`, "DELETE", null, token)
        if(response.success) {
            setFlashMessage(response.data.message, msgType)
            navigate('/')
        }
        else {
            msgType = 'error'
            setFlashMessage(response.message, msgType)
        }
    }



    return (
        <section className={styles.container}>
            <div className={styles.card}>
                {/* Foto */}
                {pet.photos && pet.photos.length > 0 && (
                    <RoundedImage
                        src={`${process.env.REACT_APP_API_URL}/images/pets/${pet.photos[0]}`}
                        alt={pet.name}
                        className={styles['mini-img']}
                    />
                )}

                {/* Informações */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>Nome: {pet.name}</div>
                    <div className={styles.infoItem}>Idade: {pet.age}</div>
                    <div className={styles.infoItem}>Cor: {pet.color}</div>
                    <div className={styles.infoItem}>Peso: {pet.weight} kg</div>
                </div>

                <div className={styles.buttonGroup}>
                    {flag ? (
                            <>

                        <form action={completeAdopt}>
                            <button className={`${styles['Button']} ${styles.adopt}`}>
                                <i className="fas fa-check fa-lg"></i> Adotar
                            </button>
                        </form>
                        <form action={removeSchedule}>
                            <button className={`${styles['Button']} ${styles.cancel}`}>
                                <i className="fas fa-trash fa-lg"></i> Cancelar Visita
                            </button>
                        </form>
                        </>
                    ) : (
                    <form action={schedulePet}>
                        <button className={`${styles['Button']} ${styles.adopt}`}>
                            <i className="fas fa-calendar-day fa-lg"></i> Marcar Visita
                        </button>
                    </form>
                    )}
                </div>

            </div>
        </section>
    )
}

export default Detail
