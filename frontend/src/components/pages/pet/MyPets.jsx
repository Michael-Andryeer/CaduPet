import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
export default function MyPets() {
  const [pets, setPets] = useState([])
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

