import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import styles from './Dashboard.module.css'
import requestData from "../../../utils/requestApi"

function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
  const [user, setUser] = useState(null)
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    async function fetchUser() {
      let msgType = 'success'
      const response = await requestData("/user/check_user", 'GET', null, token)
      if(response.success) {
        console.log(response.data)
        setUser(response.data)
      }
      else {
        msgType = 'error'
        setFlashMessage(response.message, msgType)
      }
    }

    fetchUser()
  }, [token, setFlashMessage])

  useEffect(() => {
    async function fetchPets() {
      if (user && user.id) {
        const response = await requestData(`/pet/get_pet/${user.id}`, 'GET', null, token)
        if(response.success) {
          setPets(response.data.pets)
        }
        else {
          if(response.status === 404) {
            setPets([])
          }
          else {
            setFlashMessage(response.message, 'error')
          }
        }
      }
    }
    fetchPets()
  }, [user, token, setFlashMessage])

  async function removePet(id) {

    const response = await requestData(`/pet/remove/${id}`, 'DELETE', null, token)
    if(response.success) {
      const updatedPets = pets.filter((pet) => pet.id !== id)
      setPets(updatedPets)
      setFlashMessage(response.data.message, 'success')
    }
    else {
      setFlashMessage(response.message, 'error')
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
