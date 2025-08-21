import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from '../../pages/pet_pages/Dashboard.module.css'
import requestData from "../../../utils/requestApi"



function Schedule() {
  const [pets, setPets] = useState([])
  const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
  const [user, setUser] = useState(null)
  const { setFlashMessage } = useFlashMessage()
  console.log(user)

  useEffect(() => {
    async function loadUserAndPets() {

      const userRequest = await requestData("/user/check_user", "GET", null, token)
      if(userRequest.success) {
        setUser(userRequest.data)
      }
      else {
        setFlashMessage(userRequest.message, 'error')
      }

      const petsRequest = await requestData(`/pet/schedules/${userRequest.data.id}`, "GET", null, token)
      if(petsRequest.success) {
        setPets(petsRequest.data.pets)
      }
      else {
        if(petsRequest.status === 404) {
          setPets([])
        }
        else {
          setFlashMessage(petsRequest.message, 'error')
        }
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
                    className={`${styles['status-badge']} ${{
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
