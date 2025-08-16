import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from '../../pages/pet_pages/Dashboard.module.css'

function Schedule() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const { setFlashMessage } = useFlashMessage()
  console.log(user)

  useEffect(() => {
  async function loadUserAndPets() {
    let msgType = 'success'
    try {
      // Busca usuário
      const userRes = await api.get("/user/check_user", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })
      const userData = userRes.data
      setUser(userData)

      // Busca pets
      const petsRes = await api.get(`/pet/schedules/${userData.id}`, {
          headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }})
        console.log(petsRes.data.pets)
      setPets(petsRes.data.pets)
    } catch (err) {
      msgType = 'error'
      setFlashMessage(
        err.response?.data?.message || 'Erro ao buscar dados.',
        msgType
      )
    }
  }
    loadUserAndPets()
  }, [token, setFlashMessage])




  return (
    <section>
      <h1>Agendados</h1>

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
                  <span
                    className={`${styles['status-badge']} ${
                      {
                        'Disponível': styles['status-disponivel'],
                        'Adotado': styles['status-adotado'],
                        'Visita Agendada': styles['status-visita'] 
                      }[pet.situation]
                    }`}
                  >
                    {pet.situation}
                  </span>
                </td>

                <td data-label="Ações" className={styles.alignRight}>
                    {pet.situation === 'Visita Agendada' ? (
                      <div className={styles.action}>
                        <Link
                          to={`/pet/detail/${pet.id}`}
                          state={{ flag: true }}
                          className={`${styles['action-btn']} ${styles.edit}`}
                        >
                          <i className="fas fa-info"></i> Detalhes
                        </Link>


                      </div>
                    ) : (
                      <p className={styles.rightItalic}><em>Este pet não está mais disponível, sem ações</em></p>
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

export default Schedule
