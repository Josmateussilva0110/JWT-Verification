import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Dashboard.module.css'

function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api.get('/pet/get_pet', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setPets(response.data.pets)
    }).catch(() => {
      setFlashMessage({ type: 'error', message: 'Erro ao carregar pets.' })
    })
  }, [token])

  return (
    <section>
      <h1>Meus Pets</h1>
      <Link to="/pet/add">Cadastrar Pet</Link>

      {pets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td data-label="Imagem">
                  <RoundedImage
                    src={`${process.env.REACT_APP_API_URL}/images/pets/${pet.photos[0]}`}
                    alt={pet.name}
                    className={styles['mini-img']}
                  />

                </td>

                <td data-label="Nome">
                  <span className={styles.bold}>{pet.name}</span>
                </td>

                <td data-label="Status">
                  <span className={`${styles['status-badge']} ${pet.situation === 'Disponível' ? styles['status-disponivel'] : styles['status-adotado']}`}>
                    {pet.situation}
                  </span>
                </td>

                <td data-label="Ações" className={styles.alignRight}>
                    {pet.situation === 'Disponível' ? (
                      <div className={styles.action}>
                        <button className={`${styles['action-btn']} ${styles.success}`}>
                          <i className="fas fa-check"></i> Concluir Adoção
                        </button>
                        <Link
                          to={`/pet/edit/${pet.id}`}
                          className={`${styles['action-btn']} ${styles.edit}`}
                        >
                          <i className="fas fa-edit"></i> Editar
                        </Link>
                        <button className={`${styles['action-btn']} ${styles.delete}`}>
                          <i className="fas fa-trash"></i> Excluir
                        </button>
                      </div>
                    ) : (
                      <p className={styles.rightItalic}><em>Este pet já foi adotado, sem ações</em></p>
                    )}
                  </td>


              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles['empty-message']}>Não há pets cadastrados.</p>
      )}
    </section>
  )
}

export default MyPets
