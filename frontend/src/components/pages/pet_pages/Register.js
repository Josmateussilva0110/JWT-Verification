import styles from './Register.module.css'
import PetForm from '../../form/PetForm'


function RegisterPet() {
    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>RegisterPet</h1>
            </div>
            <PetForm flag="Cadastrar">
                
            </PetForm>
        </section>
    )
}

export default RegisterPet
