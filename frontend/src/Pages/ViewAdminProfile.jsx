import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, User, Building, Phone, Briefcase } from 'lucide-react';

const ViewAdminProfile = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get(`/get-admin-data/${adminId}/`);
        setAdminData(response.data);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        alert("Failed to load admin profile");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [adminId, navigate]);

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Admin not found</div>
      </div>
    );
  }

  return (
    <div className='h-auto w-full'>
      <NavBar />
      <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
        <div className='w-full flex flex-col justify-center items-center gap-4'>
          <button
            onClick={() => navigate('/admin')}
            className='self-start bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700'
          >
            <ArrowLeft size={22} /> Back to Dashboard
          </button>

          <div className='w-full max-w-2xl bg-zinc-900 rounded-lg p-8'>
            <div className='flex flex-col justify-center items-center gap-4 mb-6'>
              <User size={60} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>
                {adminData.user?.first_name} {adminData.user?.last_name}
              </h1>
              <p className='text-gray-400'>@{adminData.user?.username}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Building size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Organization</h3>
                </div>
                <p className='text-gray-300'>{adminData.organization?.name || 'Not assigned'}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Briefcase size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Job Title</h3>
                </div>
                <p className='text-gray-300'>{adminData.job_title || 'Not provided'}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Phone size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Phone Number</h3>
                </div>
                <p className='text-gray-300'>{adminData.phone_number || 'Not provided'}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <User size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Email</h3>
                </div>
                <p className='text-gray-300'>{adminData.user?.email}</p>
              </div>
            </div>

            {adminData.organization && (
              <div className='mt-6 bg-zinc-800 p-4 rounded-lg'>
                <h3 className='font-[montserrat] text-white font-semibold mb-3'>Organization Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-400'>Type: <span className='text-white'>{adminData.organization.organization_type}</span></p>
                    <p className='text-gray-400'>City: <span className='text-white'>{adminData.organization.city}</span></p>
                  </div>
                  <div>
                    <p className='text-gray-400'>Join Code: <span className='text-white'>{adminData.organization.join_code}</span></p>
                    <p className='text-gray-400'>Country: <span className='text-white'>{adminData.organization.country}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminProfile;
