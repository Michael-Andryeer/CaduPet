import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { Card } from "../../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import { ImageIcon, Phone, User } from 'lucide-react'

export default function MyAdoptions() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdoptions() {
      try {
        const response = await api.get('/pets/myadoptions', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        setPets(response.data.pets)
      } catch (error) {
        console.error('Erro ao buscar adoções:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdoptions()
  }, [token])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Minhas Adoções</h1>
        <div className="text-center text-gray-500">Carregando adoções...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Minhas Adoções</h1>
      
      <Card className="bg-white shadow-md">
        <div className="p-4 space-y-4">
          {pets && pets.length > 0 ? (
            pets.map((pet, index) => (
              <div key={pet._id}>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {pet.images && pet.images[0] ? (
                        <AvatarImage
                          src={`http://localhost:5555/images/pets/${pet.images[0]}`}
                          alt={pet.name}
                        />
                      ) : (
                        <AvatarFallback>
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-blue-900">{pet.name}</h2>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Ligue para: </span>
                        <span className="text-sm font-medium">{pet.user.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Fale com: </span>
                        <span className="text-sm font-medium">{pet.user.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600 font-medium">
                    {pet.available ? 'Adoção em processo' : 'Adotado'}
                  </div>
                </div>
                {index < pets.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você ainda não tem adoções.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
