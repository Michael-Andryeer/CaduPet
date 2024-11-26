import { useContext, useState } from 'react';
import { Context } from '../../../context/UserContext';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' }); // Inicializando o estado com as chaves necessárias
  const { login } = useContext(Context);

  // Função para lidar com as mudanças nos campos de entrada
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  // Função para lidar com o envio do formulário
  function handleSubmit(e) {
    e.preventDefault();
    login(user); // Enviando o objeto `user` com `email` e `password` para a função `login`
  }

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email" // Nome do campo no objeto `user`
              value={user.email} // Ligando ao estado `user`
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password" // Nome do campo no objeto `user`
              value={user.password} // Ligando ao estado `user`
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
export default Login;
