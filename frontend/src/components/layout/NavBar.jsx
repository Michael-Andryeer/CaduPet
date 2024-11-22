import React from "react";
import { Link } from "react-router-dom";
import {Button} from '../../components/ui/button'
import { PawPrint } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <PawPrint className="h-6 w-6" />
          <span>PetCadu</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Adotar</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button variant="default">Cadastrar</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

