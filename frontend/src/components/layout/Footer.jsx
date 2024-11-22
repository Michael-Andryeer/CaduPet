import React from 'react'
import { PawPrint } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-6 w-full bg-background">
      <div className="container flex justify-center items-center gap-2 text-muted-foreground">
        <PawPrint className="h-4 w-4" />
        <p className="text-sm">
          <span className="font-semibold">PetCadu</span> &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

