import Input from "./Input"
import { useState } from "react"
import formStyles from './Form.module.css'
import ColorPicker from "./ColorPicker"


function PetForm({handleSubmit, petData, title, flag}) { // flag para editar ou cadastrar
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = [
        { name: "Branco", value: "branco", hex: "#ffffff" },
        { name: "Preto", value: "preto", hex: "#000000" },
        { name: "Caramelo", value: "caramelo", hex: "#c68642" },
        { name: "Mesclado", value: "mesclado", hex: "linear-gradient(45deg, #000, #fff)" },
        { name: "Cinza", value: "cinza", hex: "#808080" },
        { name: "Dourado", value: "dourado", hex: "#daa520" },
    ]

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
        <div className={formStyles.container}>
            <section className={formStyles.card}>
                <h1 className={formStyles.title}>{title}</h1>
                <form onSubmit={submit}  className={formStyles.form}>
                    <Input text="Nome do Pet" type="text" name="name" placeholder="Digite o nome" handleOnChange={handleChange} value={pet.name || ''}/>
                    <Input text="Idade do Pet" type="text" name="age" placeholder="Digite a idade" handleOnChange={handleChange} value={pet.age || ''}/>
                    <Input text="Peso do Pet" type="number" name="weight" placeholder="Digite o peso" handleOnChange={handleChange} value={pet.weight || ''}/>
                    <label>Cor do Pet:</label>
                    <ColorPicker
                        colors={colors}
                        value={pet.color}
                        onChange={(color) => setPet({ ...pet, color })}
                    />
                    <Input text="Fotos do Pet" type="file" name="photos" handleOnChange={onFileChange} multiple={true}/>
                    <div className={formStyles.preview_pet_photos}>
                        {preview.length > 0
                            ? preview.map((src, index) => (
                                <img key={index} src={src} alt={`preview ${index}`} />
                            ))
                            : Array.isArray(pet.photos) &&
                            pet.photos.map((photo, index) => (
                                <img
                                key={index}
                                src={`${process.env.REACT_APP_API_URL}/images/pets/${photo}`}
                                alt={`preview ${index}`}
                                />
                            ))}
                    </div>


                    <input type="submit" value={flag} className={formStyles.actionBtn + " " + formStyles.success}></input>
                </form>
            </section>
        </div>
    )
}

export default PetForm

