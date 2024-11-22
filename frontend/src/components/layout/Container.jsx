import React from 'react'

export default function Container({ children }) {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      {children}
    </main>
  )
}

