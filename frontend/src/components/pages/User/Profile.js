import styles from './Profile.module.css'
import formStyle from '../../form/Form.module.css'
import Input from '../../form/Input'
import {useState, useEffect} from 'react'
import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from '../../layout/RoundedImage'
import requestData from '../../../utils/requestApi'

function Profile() {
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(() => JSON.parse(localStorage.getItem('token')) || '')
    const {setFlashMessage} = useFlashMessage()

    // mandar o token do usuário para a API
    useEffect(() => {
        async function fetchUser() {
            const response = await requestData('/user/check_user', 'GET', {}, token)
            if(response.success) {
                setUser(response.data)
            }
        }
        if(token) {
            fetchUser()
        }
    }, [token])

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    function onFileChange(e) {
        setPreview(e.target.files[0])
        setUser({...user, [e.target.name]: e.target.files[0]})
    }

    async function handleSubmit(e) {
        let msgType = 'success'
        e.preventDefault()
        const formData = new FormData()
        Object.keys(user).forEach((key) => 
            formData.append(key, user[key])
        )

        const response = await requestData(`/user/${user.id}`, 'PATCH', formData, token)
        if(response.success) {
            setFlashMessage(response.data.message, msgType)
        }
        else {
            msgType = 'error'
            setFlashMessage(response.message, msgType)
        }
    }


    return (
        <div className={formStyle.container}>
            <section className={formStyle.card}>
                <div className={styles.profile_header}>
                    <h1 className={formStyle.title}>Perfil</h1>
                    {(user.photo || preview) && (
                        <RoundedImage src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API_URL}/images/users/${user.photo}`} alt={user.name} className={styles['mini-img']}>
                            
                        </RoundedImage>
                    )}
                </div>
                <form onSubmit={handleSubmit} className={formStyle.form}>
                    <Input text="Nome" type="text" name="name" placeholder="Digite seu Nome" handleOnChange={handleChange} value={user.name || ''}/>
                    <Input text="E-mail" type="email" name="email" placeholder="Digite seu Email" handleOnChange={handleChange} value={user.email || ''}/>
                    <Input text="Telefone" type="text" name="phone" placeholder="Digite seu Telefone" handleOnChange={handleChange} value={user.phone || ''}/>
                    <Input text="Foto de Perfil" type="file" name="photo" handleOnChange={onFileChange}/>
                    <input type='submit' value='Editar' className={formStyle.actionBtn + " " + formStyle.success}></input>
                </form>
            </section>
        </div>
    )
}

export default Profile
