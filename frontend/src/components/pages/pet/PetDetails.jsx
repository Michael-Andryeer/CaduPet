import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../utils/api'
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Separator } from "../../../components/ui/separator"
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails() {
  const [pet, setPet] = useState({})
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    async function fetchPet() {
      setLoading(true)
      try {
        const response = await api.get(`/pets/${id}`)
        setPet(response.data.pet) // Ajustado para acessar response.data.pet
        setLoading(false)
      } catch (error) {
        console.log(error)
        setFlashMessage('Erro ao carregar detalhes do pet', 'error')
        setLoading(false)
      }
    }
    fetchPet()
  }, [id, setFlashMessage])

  async function schedule() {
    let msgType = 'success'

    try {
      const response = await api.patch(`/pets/schedule/${pet._id}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })

      setFlashMessage(response.data.message, msgType)
    } catch (error) {
      msgType = 'error'
      setFlashMessage(error.response.data.message || 'Erro ao agendar visita', msgType)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando informações do pet...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{pet.name}</h1>
              </div>

              <div className="aspect-video w-full relative overflow-hidden rounded-lg bg-gray-100">
                {pet.images && pet.images[0] ? (
                  <img
                    src={`http://localhost:5555/images/pets/${pet.images[0]}`}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem disponível
                  </div>
                )}
              </div>

              {pet.images && pet.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {pet.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`http://localhost:5555/images/pets/${image}`}
                        alt={`${pet.name} - imagem ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-medium">{pet.age} anos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium">{pet.weight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cor:</span>
                  <span className="font-medium">{pet.color}</span>
                </div>
              </div>

              {pet.user && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Responsável:</span>
                      <span className="font-medium">{pet.user.name}</span>
                    </div>
                    {pet.user.phone && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{pet.user.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Button
                onClick={schedule}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!token}
              >
                {token ? 'Solicitar uma Visita' : 'Faça login para solicitar uma visita'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PetDetails

