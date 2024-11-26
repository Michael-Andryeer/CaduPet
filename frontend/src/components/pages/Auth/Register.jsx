import { useContext, useState } from 'react';
import Input from '../../form/Input';
import { Context } from '../../../context/UserContext';
import useAuth from '../../../hooks/useAuth'

export default function Register() {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const { register } = useContext(Context);
  const { setFlashMessage } = useAuth();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(user);
    } catch (error) {
      setFlashMessage(error.response.data.message || 'Erro ao cadastrar', 'error');
    }
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
            value={user.name}
          />
          <Input
            text="Telefone"
            type="tel"
            name="phone"
            placeholder="Digite o seu telefone"
            handleOnChange={handleChange}
            value={user.phone}
          />
          <Input
            text="E-mail"
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
            handleOnChange={handleChange}
            value={user.email}
          />
          <Input
            text="Senha"
            type="password"
            name="password"
            placeholder="Digite a sua senha"
            handleOnChange={handleChange}
            value={user.password}
          />
          <Input
            text="Confirmação de senha"
            type="password"
            name="confirmpassword"
            placeholder="Confirme a sua senha"
            handleOnChange={handleChange}
            value={user.confirmpassword}
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
  );
}