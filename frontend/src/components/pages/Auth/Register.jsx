import { useState } from 'react'
import Input from '../../form/Input'

export default function Register() {
  const [user, setUser] = useState({})

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(user)
  }

  return (
    <section className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registrar</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            text="Nome"
            type="text"
            name="name"
            placeholder="Digite o seu nome"
            handleOnChange={handleChange}
          />
          
          <Input
            text="Telefone"
            type="tel"
            name="phone"
            placeholder="Digite o seu telefone"
            handleOnChange={handleChange}
          />
          
          <Input
            text="E-mail"
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
            handleOnChange={handleChange}
          />
          
          <Input
            text="Senha"
            type="password"
            name="password"
            placeholder="Digite a sua senha"
            handleOnChange={handleChange}
          />
          
          <Input
            text="Confirmação de senha"
            type="password"
            name="confirmpassword"
            placeholder="Confirme a sua senha"
            handleOnChange={handleChange}
          />

          <button
            type="submit"
            className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </section>
  )
}

// Parei na aula de criar o objeto usuário!!!