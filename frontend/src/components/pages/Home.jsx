import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

function Home() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets')
        setPets(response.data.pets)
      } catch (err) {
        setError('Erro ao carregar os pets. Por favor, tente novamente mais tarde.')
        console.error('Erro ao buscar pets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-500">Carregando pets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pets Disponíveis para Adoção</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <Card key={pet._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{pet.name}</CardTitle>
            </CardHeader>
            <div className="relative aspect-square">
              {pet.images && pet.images.length > 0 ? (
                <img 
                  src={`http://localhost:5555/images/pets/${pet.images[0]}`} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-col gap-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-medium">{pet.age} anos</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium">{pet.weight} kg</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Cor:</span>
                  <span className="font-medium">{pet.color}</span>
                </p>
              </div>
              <Button 
                asChild 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Link to={`/pet/${pet._id}`}>
                  Ver Detalhes
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {pets.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Nenhum pet disponível para adoção no momento.
        </p>
      )}
    </section>
  )
}

export default Home

