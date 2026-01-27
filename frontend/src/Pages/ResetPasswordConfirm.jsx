import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from "../api/axios";
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const uidb64 = searchParams.get('uidb64');
  const token = searchParams.get('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!uidb64 || !token) {
      alert('Invalid password reset link');
      return;
    }

    setLoading(true);

    try {
      await api.post('/password-reset-confirm/', {
        uidb64,
        token,
        password: formData.password
      });

      alert('Password reset successfully! You can now log in with your new password.');
      navigate('/login');
    } catch (err) {
      console.error('Password reset failed:', err);
      const errorMessage = err.response?.data?.error || 'Failed to reset password. The link may be expired.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center px-4'>
      <div className='w-full max-w-md'>
        <button
          onClick={() => navigate('/login')}
          className='mb-8 bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700'
        >
          <ArrowLeft size={22} /> Back to Login
        </button>

        <div className='bg-zinc-900 rounded-lg p-8 shadow-xl'>
          <div className='flex items-center gap-3 mb-6'>
            <Lock size={32} className='text-[#9B4DFF]' />
            <h1 className='font-[montserrat] text-white text-2xl font-bold'>Reset Password</h1>
          </div>

          <p className='text-gray-400 font-[montserrat] mb-6'>
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-white font-[montserrat] text-sm mb-2'>New Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full p-3 pr-12 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter new password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
              )}
            </div>

            <div>
              <label className='block text-white font-[montserrat] text-sm mb-2'>Confirm New Password</label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className='w-full p-3 pr-12 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Confirm new password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#9B4DFF] text-white py-3 rounded font-[montserrat] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
