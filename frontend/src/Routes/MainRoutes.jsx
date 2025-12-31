import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import Volunteer from '../Pages/Volunteer'
import ForgotPassword from '../Pages/Forgotpassword'
import Features from '../Pages/Features'
import VerifyEmail from "../Pages/VerifyEmail";

const MainRoutes = () => {
  return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path='/signup' element={<SignUp/>}/>
            <Route path="/features" element={<Features />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path='/volunteer' element={<Volunteer/>}/>
        </Routes>
  )
}

export default MainRoutes