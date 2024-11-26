import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import api from '../../../utils/api'
import useFlashMessage from "../../../hooks/useFlashMessage";
export default function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token' || ''))
  const {setFlashMessage} = useFlashMessage()

  useEffect(() => {
    api.get('/pets/mypets', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setPets(response.data.pets)
    })
  },[token])

  return (
    <section>
      <div>
      <h1>CaduPet</h1>
      <Link to='/pet/add'>Cadastrar pet</Link>
      </div>
      <div>
        {pets.length > 0 ? (
          <p>Meus pets cadastrados</p>
        ) : (
          <p>Não há pets cadastrados</p>
        )}
      </div>
    </section>
  )
}

