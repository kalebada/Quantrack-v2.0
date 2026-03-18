import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import NavBar from './NavBar';

const ProtectedRoute = ({ children, adminOnly = false, volunteerOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/authenticated/');
        setIsAuthenticated(true);

        // Check roles
        try {
          await api.get('/my-admin-data/');
          setIsAdmin(true);
        } catch (adminErr) {
          // Not admin
        }

        try {
          await api.get('/my-volunteer-data/');
          setIsVolunteer(true);
        } catch (volErr) {
          // Not volunteer
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/volunteer" replace />;
  }

  if (volunteerOnly && !isVolunteer) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default ProtectedRoute;
