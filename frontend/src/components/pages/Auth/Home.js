import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from './Home.module.css'
import requestData from "../../../utils/requestApi"

function Home() {
    const [pets, setPets] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(null)
    const [loading, setLoading] = useState(true)
    const { setFlashMessage } = useFlashMessage()

    console.log(limit)

    useEffect(() => {
        async function fetchPets() {
            try {
                setLoading(true)
                const response = await requestData(`/pet/get_pet`, 'GET', {page: currentPage, limit: 6})
                if(response.success) {
                    setPets(response.data.pets)
                    setTotalPages(response.data.totalPages)
                    if(response.data.limit) {
                        setLimit(response.data.limit)
                    }
                }
            } catch(error) {
                setFlashMessage('Erro ao carregar pets.', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchPets()
    }, [currentPage, setFlashMessage])

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Disponíveis</h1>

            {loading ? (
                <p>Carregando pets...</p>
            ) : pets.length > 0 ? (
                <>
                    <div className={styles.cardGrid}>
                        {pets.map((pet) => (
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

                    {/* 🔹 Paginação */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                onClick={() => goToPage(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                ⬅ Anterior
                            </button>

                            <span>Página {currentPage} de {totalPages}</span>

                            <button 
                                onClick={() => goToPage(currentPage + 1)} 
                                disabled={currentPage >= totalPages}
                            >
                                Próxima ➡
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className={styles.emptyMessage}>Não há pets cadastrados.</p>
            )}
        </section>
    )
}

export default Home
