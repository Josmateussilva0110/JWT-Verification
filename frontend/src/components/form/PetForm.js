import Input from "./Input"
import { useState } from "react"
import formStyles from './Form.module.css'
import Select from "./Select"


function PetForm({handleSubmit, petData, flag}) { // flag para editar ou cadastrar
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ['Branco', 'Preto', 'Caramelo', 'Mesclado']

    function handleChange(e) {

    }

    function onFileChange(e) {

    }

    function handleColor(e) {

    }

    return (
        <form className={formStyles.form_container}>
            <Input text="Nome do Pet" type="text" name="name" placeholder="Digite o nome" handleOnChange={handleChange} value={pet.name || ''}/>
            <Input text="Idade do Pet" type="text" name="age" placeholder="Digite a idade" handleOnChange={handleChange} value={pet.age || ''}/>
            <Input text="Peso do Pet" type="number" name="weight" placeholder="Digite o peso" handleOnChange={handleChange} value={pet.weight || ''}/>
            <Input text="Fotos do Pet" type="file" name="photos" handleOnChange={onFileChange} multiple={true}/>
            <Select name="color" text="Selecione uma cor" options={colors} handleOnChange={handleColor} value={pet.color || ''}></Select>
            <input type="submit" value={flag}></input>
        </form>
    )
}

export default PetForm

