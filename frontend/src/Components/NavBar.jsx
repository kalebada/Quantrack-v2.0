import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.webp';
import api from '../api/axios';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const authHint = localStorage.getItem('isAuthenticated') === 'true';
      if (!authHint && !['/admin', '/volunteer', '/analytics', '/create-event', '/summary-certificate'].includes(location.pathname)) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await api.get('/authenticated/');
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');

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
          } catch {
            try {
              await api.get('/my-admin-data/');
              setIsAdmin(true);
              localStorage.setItem('userRole', 'admin');
            } catch { }
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
      }
    };
    checkAuth();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/logout/');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsVolunteer(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='bg-zinc-900 w-full flex justify-between items-center px-4 py-2 lg:py-0 text-black sticky top-0 border-b border-zinc-500'>
      <a href='/' className='flex items-center'>
        <img src={logo} className='w-[20%] lg:w-[8%]' />
        <h1 className='text-white font-[Gued] text-2xl lg:text-3xl'>Quantrack</h1>
      </a>
      <div className='flex items-center gap-4 font-[montserrat] text-sm text-white'>
        {isAuthenticated ? (
          <div className='flex gap-2'>
            {isAdmin && (
              <>
                <Link to='/analytics' className='px-3 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Analytics</Link>
                <Link to='/create-event' className='px-3 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Create Event</Link>
              </>
            )}
            {isVolunteer && (
              <>
              </>
            )}
            <button
              onClick={handleLogout}
              className='px-4 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to='/verify-email' className='px-4 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Verify</Link>
            <Link to='/login' className='px-4 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Login</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default NavBar;