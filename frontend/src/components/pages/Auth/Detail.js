import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Detail.module.css'

function Detail() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()
    const location = useLocation()
    const flag = location.state?.flag

    useEffect(() => {
        api.get(`/pet/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            console.log(response.data.pet)
            setPet(response.data.pet)
        })
    }, [token, id])

    async function schedulePet() {
        let msgType = 'success'
        let msgText = ''
        try {
            const response = await api.post(`/pet/schedule/${id}`, null, {
                headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
            })
            const data = response.data 
            msgText = data.message
            navigate('/')
        } catch(err) {
            msgText = err.response?.data?.message || 'Erro desconhecido'
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
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

                {/* Botão */}
                {flag ? (
                        <>
                    <form action={schedulePet}>
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
        </section>
    )
}

export default Detail
