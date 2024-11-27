import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Components
import Footer from './components/layout/Footer'
import NavBar from './components/layout/NavBar'
import Container from './components/layout/Container'
import Message from './components/layout/Message'
// Components

// pages
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/user/Profile'
import MyPets from './components/pages/pet/MyPets'
import AddPets from './components/pages/pet/AddPets'
import PetDetails from './components/pages/pet/PetDetails'
// pages

// Context
import { UserProvider } from './context/UserContext'
// Context

function App() {
  return (
    <Router>
      <UserProvider>
      <NavBar />
      <Message/>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/pet/mypets" element={<MyPets />} />
          <Route path="/pet/add" element={<AddPets />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />
      </UserProvider>
    </Router>
  )
}
export default App

