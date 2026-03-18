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
import ProtectedRoute from '../Components/ProtectedRoute'

const MainRoutes = () => {
  return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path='/signup' element={<SignUp/>}/>
            <Route path="/features" element={<Features />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path='/join-organization' element={
              <ProtectedRoute>
                <JoinOrganization />
              </ProtectedRoute>
            }/>
            <Route path='/volunteer' element={
              <ProtectedRoute volunteerOnly>
                <Volunteer />
              </ProtectedRoute>
            }/>
            <Route path='/admin' element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }/>
            <Route path='/update-event/:eventId' element={
              <ProtectedRoute adminOnly>
                <UpdateEvent />
              </ProtectedRoute>
            }/>
            <Route path='/event-participations/:eventId' element={
              <ProtectedRoute adminOnly>
                <EventParticipations />
              </ProtectedRoute>
            }/>
            <Route path='/reset-password-confirm' element={<ResetPasswordConfirm/>}/>
            <Route path='/analytics' element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }/>
            {/* New routes placeholders */}
            <Route path='/create-event' element={
              <ProtectedRoute adminOnly>
                <div className='h-screen w-full bg-zinc-950 flex justify-center items-center text-white text-xl'>Create Event Page (Coming Soon)</div>
              </ProtectedRoute>
            }/>
            <Route path='/qr-scanner' element={
              <ProtectedRoute volunteerOnly>
                <div className='h-screen w-full bg-zinc-950 flex justify-center items-center text-white text-xl'>QR Scanner (Coming Soon)</div>
              </ProtectedRoute>
            }/>
            <Route path='/summary-certificate' element={
              <ProtectedRoute>
                <div className='h-screen w-full bg-zinc-950 flex justify-center items-center text-white text-xl'>Summary Certificate (Coming Soon)</div>
              </ProtectedRoute>
            }/>
        </Routes>
  )
}

export default MainRoutes
