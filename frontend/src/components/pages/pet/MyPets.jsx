import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from '../../../utils/api'
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import { Card } from "../../../components/ui/card"
import { Trash2, ImageIcon, Check, Phone, User } from 'lucide-react'

export default function MyPets() {
  const [pets, setPets] = useState([])
  const [adoptedPets, setAdoptedPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    // Fetch pets owned by the user
    api.get('/pets/mypets', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setPets(response.data.pets)
    })

    // Fetch pets adopted by the user
    api.get('/pets/myadoptions', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setAdoptedPets(response.data.pets)
    })
  }, [token])

  async function removePet(id) {
    try {
      const response = await api.delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })

      const updatedPets = pets.filter((pet) => pet._id !== id)
      setPets(updatedPets)
      setFlashMessage(response.data.message, 'success')
    } catch (error) {
      setFlashMessage(error.response.data.message, 'error')
    }
  }

  async function concludeAdoption(id) {
    try {
      const response = await api.patch(`/pets/conclude/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      
      setFlashMessage(response.data.message, 'success');
      
      // Atualiza o status do pet na lista local
      const updatedPets = pets.map(pet => 
        pet._id === id ? { ...pet, available: false } : pet
      );
      setPets(updatedPets);
    } catch (error) {
      setFlashMessage(error.response?.data?.message || 'Erro ao concluir adoção', 'error');
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Meus pets</h1>
        <Button 
          asChild
          className="bg-blue-700 hover:bg-blue-800"
        >
          <Link to="/pet/add">Cadastrar Pet</Link>
        </Button>
      </div>

      {/* Pets que o usuário cadastrou */}
      {pets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Pets Cadastrados</h2>
          <Card className="bg-white shadow-md">
            <div className="p-4 space-y-4">
              {pets.map((pet) => (
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
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="space-y-1">
                        <span className="text-lg text-blue-700 font-medium">
                          {pet.name}
                        </span>
                        {pet.adopter && (
                          <div className="space-y-1">
                            {pet.available ? (
                              <p className="text-sm text-yellow-600">
                                Agendado para visita
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-green-600">
                                  Adotado
                                </p>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span className="text-sm">Adotado por: </span>
                                  <span className="text-sm font-medium">{pet.adopter.name}</span>
                                </div>
                                {pet.adopter.phone && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">Contato: </span>
                                    <span className="text-sm font-medium">{pet.adopter.phone}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {pet.adopter && pet.available && (
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => concludeAdoption(pet._id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Concluir Adoção
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-blue-700 text-blue-700 hover:bg-blue-50"
                        onClick={() => removePet(pet._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Pets que o usuário adotou */}
      {adoptedPets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Pets Adotados</h2>
          <Card className="bg-white shadow-md">
            <div className="p-4 space-y-4">
              {adoptedPets.map((pet) => (
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
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="space-y-1">
                        <span className="text-lg text-blue-700 font-medium">
                          {pet.name}
                        </span>
                        <div className="space-y-1">
                          {!pet.available ? (
                            <>
                              <div className="flex items-center gap-1 text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="text-sm">Dono anterior: </span>
                                <span className="text-sm font-medium">{pet.user.name}</span>
                              </div>
                              {pet.user.phone && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  <span className="text-sm">Contato: </span>
                                  <span className="text-sm font-medium">{pet.user.phone}</span>
                                </div>
                              )}
                              <p className="text-sm text-green-600">
                                Adotado
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="text-sm">Dono: </span>
                                <span className="text-sm font-medium">{pet.user.name}</span>
                              </div>
                              {pet.user.phone && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  <span className="text-sm">Contato: </span>
                                  <span className="text-sm font-medium">{pet.user.phone}</span>
                                </div>
                              )}
                              <p className="text-sm text-yellow-600">
                                Agendado para visita
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Mensagem quando não há pets */}
      {pets.length === 0 && adoptedPets.length === 0 && (
        <Card className="bg-white shadow-md">
          <div className="p-8 text-center text-gray-500">
            Não há pets cadastrados ou adotados
          </div>
        </Card>
      )}
    </div>
  )
}

