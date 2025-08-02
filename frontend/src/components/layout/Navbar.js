import {Link} from 'react-router-dom'
import { useContext } from 'react'
import styles from './Navbar.module.css'
import {Context} from '../../context/UserContext'

function Navbar() {
    const {authenticated, logout} = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>

                {authenticated ? (
                    <>
                        <li>
                            <Link to="/user/profile">Perfil</Link>
                        </li>

                        <li>
                            <Link to="/pet/myPets">Meus Pets</Link>
                        </li>
                        <li onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>

                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    </>
                )}


            </ul>
        </nav>
    )
}

export default Navbar
