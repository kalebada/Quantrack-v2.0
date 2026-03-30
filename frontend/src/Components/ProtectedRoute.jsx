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

        // Check roles from localStorage first to avoid 403 console errors
        const storedRole = localStorage.getItem('userRole');
        if (storedRole === 'admin') {
          setIsAdmin(true);
        } else if (storedRole === 'volunteer') {
          setIsVolunteer(true);
        } else {
          try {
            await api.get('/my-volunteer-data/');
            setIsVolunteer(true);
            localStorage.setItem('userRole', 'volunteer');
          } catch (volErr) {
            try {
              await api.get('/my-admin-data/');
              setIsAdmin(true);
              localStorage.setItem('userRole', 'admin');
            } catch (adminErr) {
              // Not admin
            }
          }
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
      {children}
    </>
  );
};

export default ProtectedRoute;
