import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Detail.module.css'

function Schedule() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

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
                <button className={styles.adoptButton}>
                    Adotar
                </button>
            </div>
        </section>
    )
}

export default Schedule
