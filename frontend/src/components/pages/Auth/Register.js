import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Link } from 'react-router-dom'
import { useState, useContext} from 'react'
import { Context } from '../../../context/UserContext'

function Register() {
    const [user, setUser] = useState({})
    const {register} = useContext(Context)

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    function handleSubmit(e) {
        e.preventDefault()
        register(user) // chamada da API
    }

    return (
        <div className={styles.container}>
            <section className={styles.card}>
                <h1 className={styles.title}>Criar Conta</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input text="Nome" type="text" name="name" placeholder="Digite seu Nome" handleOnChange={handleChange}/>
                    <Input text="Telefone" type="text" name="phone" placeholder="Digite seu Telefone" handleOnChange={handleChange}/>
                    <Input text="E-mail" type="email" name="email" placeholder="Digite seu Email" handleOnChange={handleChange}/>
                    <Input text="Senha" type="password" name="password" placeholder="Digite sua Senha" handleOnChange={handleChange}/>
                    <Input text="Confirmar Senha" type="password" name="confirm_password" placeholder="Confirmar Senha" handleOnChange={handleChange}/>
                    
                    <input type="submit" value="Cadastrar" className={styles.actionBtn + " " + styles.success}/>
                </form>

                <p className={styles.footerText}>
                    Já tem conta? <Link to="/login" className={styles.detail}>Clique aqui.</Link>
                </p>
            </section>
        </div>
    )
}

export default Register
