import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from '../../../utils/api'
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import {  Trash2 } from 'lucide-react'

export default function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api.get('/pets/mypets', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setPets(response.data.pets)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Meus pets</h1>
        <Button 
          asChild
          className="bg-blue-700 hover:bg-blue-800"
        >
          <Link to="/pet/add">Cadastrar Pet</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {pets.length > 0 ? (
          pets.map((pet) => (
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
                  <span className="text-lg text-blue-700 font-medium">
                    {pet.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  
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
          ))
        ) : (
          <p className="text-center text-gray-500">Não há pets cadastrados</p>
        )}
      </div>
    </div>
  )
}
