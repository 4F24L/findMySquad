import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Teams from './pages/Teams'
import Chats from './pages/Chats'
import Hackathons from './pages/Hackathons'
import Profile from './pages/Profile'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/teams' element={<Teams/>}/>
      <Route path='/hackathons' element={<Hackathons/>}/>
      <Route path='/chats' element={<Chats/>}/>
      <Route path='/profile' element={<Profile/>}/>

    </Routes>
  )
}

export default App
