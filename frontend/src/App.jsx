import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Components
import Footer from './components/layout/Footer'
import NavBar from './components/layout/NavBar'
import Container from './components/layout/Container'
// Components

// pages
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
// pages

function App() {
  return (
    <Router>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  )
}
export default App

