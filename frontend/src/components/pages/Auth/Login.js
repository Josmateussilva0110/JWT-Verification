import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Link } from 'react-router-dom'
import { useState, useContext} from 'react'
import { Context } from '../../../context/UserContext'


function Login() {
    const [user, setUser] = useState({})
    const {login} = useContext(Context) // funções que estão sendo retornadas do context

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    function handleSubmit(e) {
        e.preventDefault()
        //console.log(user)
        login(user) // chamada da API
    }

    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input text="E-mail" type="email" name="email" placeholder="Digite seu Email" handleOnChange={handleChange}/>
                <Input text="Senha" type="password" name="password" placeholder="Digite Sua Senha" handleOnChange={handleChange}/>
                <input type="submit" value="Entrar"></input>
            </form>

            <p>
                Não tem conta? clique em <Link to="/register">Cadastrar</Link>
            </p>
        </section>
    )
}

export default Login
