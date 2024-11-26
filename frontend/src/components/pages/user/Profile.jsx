'use client'

import React, { useState } from 'react'
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { ImageIcon } from 'lucide-react'

export default function Profile() {
  const [preview, setPreview] = useState(null)
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
  })

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function onFileChange(e) {
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(user)
  }

  return (
    <section className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>Imagem:</span>
                    <Input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={onFileChange}
                      className="max-w-[230px]"
                    />
                  </div>
                </Label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail:</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite o seu e-mail"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome:</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite o seu nome"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone:</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Digite o seu telefone"
                  value={user.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha:</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Digite a sua senha"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmpassword">Confirmação de senha:</Label>
                <Input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="Confirme a sua senha"
                  value={user.confirmpassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full max-w-sm mx-auto block">
              Atualizar
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

