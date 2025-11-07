import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import Volunteer from '../Pages/Volunteer'

const MainRoutes = () => {
  return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/volunteer' element={<Volunteer/>}/>
        </Routes>
  )
}

export default MainRoutes