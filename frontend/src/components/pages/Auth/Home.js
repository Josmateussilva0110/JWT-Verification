import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Home.module.css'

function Home() {
    const [pets, setPets] = useState([])
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        let msgType = 'success'
        api.get("/pet/get_pet")
            .then((response) => {
                console.log(response.data.pets)
                setPets(response.data.pets)
            })
            .catch(() => {
                msgType = 'error'
                setFlashMessage('Erro ao carregar pets.', msgType)
            })
    }, [setFlashMessage])

    const availablePets = pets.filter((pet) => pet.situation === 'Disponível')

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Disponíveis</h1>

            {
                availablePets.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {
                            availablePets.map((pet) => (
                                <div key={pet.id} className={styles.card}>
                                    <div className={styles.imageWrapper}>
                                        <RoundedImage
                                            src={`${process.env.REACT_APP_API_URL}/images/pets/${pet.photos[0]}`}
                                            alt={pet.name}
                                            className={styles['mini-img']}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h2 className={styles.petName}>{pet.name}</h2>
                                        <span className={`${styles.status} ${styles.disponivel}`}>
                                            {pet.situation}
                                        </span>
                                        <Link
                                            to={`/pet/detail/${pet.id}`}
                                            className={`${styles.actionBtn} ${styles.detail}`}
                                        >
                                            <i className="fa-solid fa-info fa-lg"></i> Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className={styles.emptyMessage}>Não há pets cadastrados.</p>
                )}
        </section>
    )
}

export default Home
