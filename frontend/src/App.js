import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Auth/Home'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import { UserProvider } from './context/UserContext'
import Message from './components/layout/Message'
import Profile from './components/pages/User/Profile'
import MyPets from './components/pages/pet_pages/MyPets'
import RegisterPet from './components/pages/pet_pages/Register'


function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar>

        </Navbar>

        <Message>
          
        </Message>

        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pet/myPets" element={<MyPets />} />
            <Route path="/pet/add" element={<RegisterPet />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer>

        </Footer>
      </UserProvider>
    </Router>
  )
}

export default App
