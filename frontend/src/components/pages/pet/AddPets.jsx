import api from '../../../utils/api'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import PetForm from '../../form/PetForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { PawPrint } from 'lucide-react'

export default function AddPet() {
  

  return (
    <section className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PawPrint className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Cadastrar Pet</CardTitle>
          <CardDescription className="text-lg mt-2">
            Depois ele ficará disponível para adoção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PetForm />
        </CardContent>
      </Card>
    </section>
  )
}


