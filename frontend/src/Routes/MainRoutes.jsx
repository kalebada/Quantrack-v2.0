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
import ForgotPassword from '../Pages/ForgotPassword'
import Features from '../Pages/Features'
import VerifyEmail from "../Pages/VerifyEmail"
import QRScanner from '../Pages/QRScanner'
import ProtectedRoute from '../Components/ProtectedRoute'
import UpdateOrganization from '../Pages/UpdateOrganization'
import CreateEvent from '../Pages/CreateEvent'
import UpdateVolunteerProfile from '../Pages/UpdateVolunteerProfile'
import UpdateAdminProfile from '../Pages/UpdateAdminProfile'
import ViewVolunteerProfile from '../Pages/ViewVolunteerProfile'
import ViewAdminProfile from '../Pages/ViewAdminProfile'
import SummaryCertificate from '../Pages/SummaryCertificate'
import QuitOrganization from '../Pages/QuitOrganization'

const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="/features" element={<Features />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/qr-scanner" element={
        <ProtectedRoute volunteerOnly>
          <QRScanner />
        </ProtectedRoute>
      } />
      <Route path='/join-organization' element={
        <ProtectedRoute>
          <JoinOrganization />
        </ProtectedRoute>
      } />
      <Route path='/volunteer' element={
        <ProtectedRoute volunteerOnly>
          <Volunteer />
        </ProtectedRoute>
      } />
      <Route path='/admin' element={
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      } />
      <Route path='/update-event/:eventId' element={
        <ProtectedRoute adminOnly>
          <UpdateEvent />
        </ProtectedRoute>
      } />
      <Route path='/event-participations/:eventId' element={
        <ProtectedRoute adminOnly>
          <EventParticipations />
        </ProtectedRoute>
      } />
      <Route path='/reset-password-confirm' element={<ResetPasswordConfirm />} />
      <Route path='/analytics' element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />

      <Route path='/create-event' element={
        <ProtectedRoute adminOnly>
          <CreateEvent />
        </ProtectedRoute>
      } />

      <Route path='/update-organization' element={
        <ProtectedRoute adminOnly>
          <UpdateOrganization />
        </ProtectedRoute>
      } />

      <Route path='/update-volunteer-profile' element={
        <ProtectedRoute volunteerOnly>
          <UpdateVolunteerProfile />
        </ProtectedRoute>
      } />

      <Route path='/update-admin-profile' element={
        <ProtectedRoute adminOnly>
          <UpdateAdminProfile />
        </ProtectedRoute>
      } />

      <Route path='/view-volunteer-profile/:volunteerId' element={
        <ProtectedRoute adminOnly>
          <ViewVolunteerProfile />
        </ProtectedRoute>
      } />

      <Route path='/view-admin-profile/:adminId' element={
        <ProtectedRoute adminOnly>
          <ViewAdminProfile />
        </ProtectedRoute>
      } />

      <Route path='/summary-certificate' element={
        <ProtectedRoute volunteerOnly>
          <SummaryCertificate />
        </ProtectedRoute>
      } />

      <Route path='/quit-organization' element={
        <ProtectedRoute volunteerOnly>
          <QuitOrganization />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default MainRoutes
