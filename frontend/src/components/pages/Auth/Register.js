import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Link } from 'react-router-dom'


function Register() {
    function handleChange(e) {

    }
    return (
        <section className={styles.form_container}>
            <h1>Register</h1>
            <form>
                <Input text="Nome" type="text" name="name" placeholder="Digite seu Nome" handleOnChange={handleChange}/>
                <Input text="Telefone" type="text" name="fone" placeholder="Digite seu Telefone" handleOnChange={handleChange}/>
                <Input text="E-mail" type="email" name="email" placeholder="Digite seu Email" handleOnChange={handleChange}/>
                <Input text="Senha" type="password" name="password" placeholder="Digite Sua Senha" handleOnChange={handleChange}/>
                <Input text="Confirmar Senha" type="password" name="confirm_password" placeholder="Confirmar Senha" handleOnChange={handleChange}/>
                <input type="submit" value="Cadastrar"></input>
            </form>

            <p>
                Já tem conta? <Link to="/login">Clique aqui.</Link>
            </p>
        </section>
    )
}

export default Register
