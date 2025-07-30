import styles from './Profile.module.css'
import formStyle from '../../form/Form.module.css'
import Input from '../../form/Input'
import {useState, useEffect} from 'react'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'

function Profile() {
    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()

    // mandar o token do usuário para a API
    useEffect(() => {
        api.get('/user/check_user', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            },
        }).then((response) => {
            setUser(response.data)
        })
    }, [token])

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    function onFileChange(e) {
        setUser({...user, [e.target.name]: e.target.files[0]})
    }

    async function handleSubmit(e) {
        let msgType = 'success'
        e.preventDefault()
        const formData = new FormData()
        Object.keys(user).forEach((key) => 
            formData.append(key, user[key])
        )

        try {
            const response = await api.patch(`/user/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            setFlashMessage(response.data.message, msgType)
        } catch(err) {
            msgType = 'error'
            setFlashMessage(err.response?.data?.message || 'Erro ao atualizar usuário.', msgType)
        }
    }


    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Profile</h1>
                <p>Preview Imagem</p>
            </div>
            <form onSubmit={handleSubmit} className={formStyle.form_container}>
                <Input text="Nome" type="text" name="name" placeholder="Digite seu Nome" handleOnChange={handleChange} value={user.name || ''}/>
                <Input text="E-mail" type="email" name="email" placeholder="Digite seu Email" handleOnChange={handleChange} value={user.email || ''}/>
                <Input text="Telefone" type="text" name="phone" placeholder="Digite seu Telefone" handleOnChange={handleChange} value={user.phone || ''}/>
                <Input text="Foto de Perfil" type="file" name="photo" handleOnChange={onFileChange}/>
                <input type='submit' value='Editar'></input>
            </form>
        </section>
    )
}

export default Profile
