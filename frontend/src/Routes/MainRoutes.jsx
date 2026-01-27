import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import Volunteer from '../Pages/Volunteer'
import JoinOrganization from '../Pages/JoinOrganization'
import UpdateEvent from '../Pages/UpdateEvent'
import EventParticipations from '../Pages/EventParticipations'
import ResetPasswordConfirm from '../Pages/ResetPasswordConfirm'
import Analytics from '../Pages/Analytics'
import Admin from '../Pages/Admin'
import ForgotPassword from '../Pages/Forgotpassword'
import Features from '../Pages/Features'
import VerifyEmail from "../Pages/VerifyEmail"

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
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/update-event/:eventId' element={<UpdateEvent/>}/>
            <Route path='/event-participations/:eventId' element={<EventParticipations/>}/>
            <Route path='/reset-password-confirm' element={<ResetPasswordConfirm/>}/>
            <Route path='/analytics' element={<Analytics/>}/>
        </Routes>
  )
}

export default MainRoutes
