import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Dashboard.module.css'

function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    async function fetchUser() {
      let msgType = 'success'
      try {
        const response = await api.get("/user/check_user", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`
          }
        })

        console.log(response.data)
        setUser(response.data)
      } catch (err) {
        msgType = 'error'
        setFlashMessage(err.response?.data?.message || 'Erro ao buscar usuário.', msgType)
      }
    }

    fetchUser()
  }, [token, setFlashMessage])

  useEffect(() => {
    async function fetchPets() {
      if (user && user.id) {
        try {
          const response = await api.get(`/pet/get_pet/${user.id}`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`
            }
          })
          console.log('response: ', response)
          setPets(response.data.pets)
        } catch (err) {
          if (err.response?.status === 404) {
            setPets([])
          } else {
            setFlashMessage(err.response?.data?.message || 'Erro ao buscar dados.', 'error')
          }
        }
      }
    }
    fetchPets()
  }, [user, token, setFlashMessage])

  async function removePet(id) {
    let msgType = 'success'
    try {
      const response = await api.delete(`/pet/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })

      const updatedPets = pets.filter((pet) => pet.id !== id)
      setPets(updatedPets)

      setFlashMessage(response.data.message, msgType)
    } catch (err) {
      msgType = 'error'
      setFlashMessage(err.response?.data?.message || 'Erro ao remover pet.', msgType)
    }
  }


  return (
    <section>
      <h1>Meus Pets</h1>
      <Link className={styles.section_a} to="/pet/add">Cadastrar Pet</Link>

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
                  {pet.situation === 'Disponível' ? (
                    <div className={styles.action}>
                      <Link
                        to={`/pet/edit/${pet.id}`}
                        className={`${styles['action-btn']} ${styles.edit}`}
                      >
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      <button onClick={() => {
                        removePet(pet.id)
                      }} className={`${styles['action-btn']} ${styles.delete}`}>
                        <i className="fas fa-trash"></i> Excluir
                      </button>
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

export default MyPets
