import { useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Create from './pages/Create'
import HomePg from './pages/homepg'
import { AuthContextProvider, authContext} from './context/authContext'
import Nomination from './pages/Nomination'
import User from './pages/User'
import Main from './pages/Main'
import Voting from './pages/Votings';
import toast, { Toaster } from 'react-hot-toast';
import Homes from './pages/homes'

function App() {


  return (
    <>
  <AuthContextProvider>
  <Toaster />
  <Routes>
    <Route path='/' element={<Create/>}></Route>
    <Route path='/join' element={<Home/>}></Route>
    <Route path='/home' element={<Homes/>}>
    <Route path='nominations' element={<Nomination/>}></Route>
    <Route path='main' element={<Main/>}></Route>
    <Route index element={<Nomination/>}></Route>
    <Route path='users' element={<User/>}></Route>
    <Route path='voting' element={<Voting/>}></Route>
    </Route>
  </Routes>
  </AuthContextProvider>
    </>
  )
}

export default App
