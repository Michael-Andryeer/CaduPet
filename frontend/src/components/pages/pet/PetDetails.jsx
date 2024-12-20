import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../utils/api'
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails() {
  const [pet, setPet] = useState({})
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const [token] = useState(localStorage.getItem('token') || '')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/pets/${id}`)
        setPet(response.data.pet)
      } catch (error) {
        console.log(error)
        setFlashMessage('Erro ao carregar detalhes do pet', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchPet()
  }, [id])

  async function schedule() {
    let msgType = 'success'

    try {
      const response = await api.patch(`/pets/schedule/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })
      setFlashMessage(response.data.message, msgType)
      navigate('/pet/mypets')
    } catch (error) {
      msgType = 'error'
      setFlashMessage(error.response?.data?.message || 'Erro ao agendar visita', msgType)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando informações do pet...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{pet.name}</h1>
                {!pet.available && (
                  <p className="text-green-600 font-medium">Adotado</p>
                )}
              </div>

              <Card className="overflow-hidden border-none shadow-lg">
                <div className="relative bg-gradient-to-b from-white to-gray-50">
                  <div className="aspect-square w-full relative overflow-hidden">
                    {pet.images && pet.images[0] ? (
                      <img
                        src={`http://localhost:5555/images/pets/${pet.images[0]}`}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        Sem imagem disponível
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {pet.images && pet.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {pet.images.slice(1).map((image, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <img
                          src={`http://localhost:5555/images/pets/${image}`}
                          alt={`${pet.name} - imagem ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="border-none shadow-md">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>

              {pet.user && (
                <Card className="border-none shadow-md">
                  <CardContent className="p-4 space-y-2">
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
                  </CardContent>
                </Card>
              )}

              {pet.available && (
                <Button
                  onClick={schedule}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={!token || pet.adopter}
                >
                  {!token 
                    ? 'Faça login para solicitar uma visita'
                    : pet.adopter
                      ? 'Pet já agendado para visita'
                      : 'Solicitar uma Visita'
                  }
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default PetDetails

