import { Link } from "react-router-dom";
import { Button } from '../../components/ui/button';
import { PawPrint } from 'lucide-react';
// Context
import { Context } from '../../context/UserContext';
import { useContext } from "react";

export default function Navbar() {
  const { authenticated, logout } = useContext(Context);
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <PawPrint className="h-6 w-6" />
          <span>PetCadu</span>
        </Link>
        {/* Navegação */}
        <div className="ml-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Adotar</Button>
          </Link>
          {authenticated ? (
            // Exibe quando o usuário está autenticado
            <>
              <Link to="/user/profile">
                <Button variant="ghost">Perfil</Button>
              </Link>
              <Link to={'/'}>
              <Button variant="ghost" onClick={logout}>Sair</Button>
              </Link>
              
            </>
          ) : (
            // Exibe quando o usuário NÃO está autenticado
            <>
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
