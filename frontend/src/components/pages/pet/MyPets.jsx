import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from '../../../utils/api'
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { PlusCircle, Loader2 } from 'lucide-react'

export default function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api.get('/pets/mypets', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setPets(response.data.pets)
      setLoading(false)
    })
    .catch((error) => {
      setFlashMessage('Erro ao carregar os pets', 'error')
      setLoading(false)
    })
  }, [token, setFlashMessage])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">CaduPet</CardTitle>
            <CardDescription>Gerencie seus pets cadastrados</CardDescription>
          </div>
          <Button asChild>
            <Link to='/pet/add' className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Cadastrar pet
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Idade: {pet.age}</p>
                    <p>Peso: {pet.weight} kg</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link to={`/pet/${pet._id}`}>Ver detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Não há pets cadastrados</p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

