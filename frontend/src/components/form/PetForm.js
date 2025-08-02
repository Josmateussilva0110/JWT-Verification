import Input from "./Input"
import { useState } from "react"
import formStyles from './Form.module.css'
import Select from "./Select"


function PetForm({handleSubmit, petData, flag}) { // flag para editar ou cadastrar
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ['Branco', 'Preto', 'Caramelo', 'Mesclado']

    function handleChange(event) {
        setPet({...pet, [event.target.name]: event.target.value})
    }

    function onFileChange(event) {
        const filesArray = Array.from(event.target.files)
        const previews = filesArray.map(file => URL.createObjectURL(file))

        setPet({ ...pet, photos: filesArray }) // Agora photos é um array
        setPreview(previews)
    }


    function handleColor(event) {
        setPet({...pet, color: event.target.options[event.target.selectedIndex].text})
    }

    function submit(event) {
        event.preventDefault()
        handleSubmit(pet)
    }

    return (
        <form onSubmit={submit}  className={formStyles.form_container}>
            <Input text="Nome do Pet" type="text" name="name" placeholder="Digite o nome" handleOnChange={handleChange} value={pet.name || ''}/>
            <Input text="Idade do Pet" type="text" name="age" placeholder="Digite a idade" handleOnChange={handleChange} value={pet.age || ''}/>
            <Input text="Peso do Pet" type="number" name="weight" placeholder="Digite o peso" handleOnChange={handleChange} value={pet.weight || ''}/>
            <Select name="color" text="Selecione uma cor" options={colors} handleOnChange={handleColor} value={pet.color || ''}></Select>
            <Input text="Fotos do Pet" type="file" name="photos" handleOnChange={onFileChange} multiple={true}/>
            <div className={formStyles.preview_pet_photos}>
                {preview.length > 0
                    ? preview.map((src, index) => (
                        <img key={index} src={src} alt={`preview ${index}`} />
                    ))
                    : Array.isArray(pet.photos) &&
                    pet.photos.map((photo, index) => (
                        <img key={index} src={URL.createObjectURL(photo)} alt={`preview ${index}`} />
                    ))
                }
            </div>

            <input type="submit" value={flag}></input>
        </form>
    )
}

export default PetForm

