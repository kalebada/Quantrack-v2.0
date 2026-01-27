import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, User, Calendar, Award, Clock } from 'lucide-react';

const ViewVolunteerProfile = () => {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [volunteerData, setVolunteerData] = useState(null);

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      try {
        const response = await api.get(`/get-volunteer-data/${volunteerId}/`);
        setVolunteerData(response.data);
      } catch (err) {
        console.error("Failed to fetch volunteer profile:", err);
        alert("Failed to load volunteer profile");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteerProfile();
  }, [volunteerId, navigate]);

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  if (!volunteerData) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Volunteer not found</div>
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
                {volunteerData.user?.first_name} {volunteerData.user?.last_name}
              </h1>
              <p className='text-gray-400'>@{volunteerData.user?.username}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Calendar size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Date of Birth</h3>
                </div>
                <p className='text-gray-300'>{volunteerData.date_of_birth || 'Not provided'}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Award size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>School/Organization</h3>
                </div>
                <p className='text-gray-300'>{volunteerData.school_or_organization || 'Not provided'}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Clock size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Member Since</h3>
                </div>
                <p className='text-gray-300'>{new Date(volunteerData.created_at).toLocaleDateString()}</p>
              </div>

              <div className='bg-zinc-800 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <User size={20} className='text-[#9B4DFF]' />
                  <h3 className='font-[montserrat] text-white font-semibold'>Email</h3>
                </div>
                <p className='text-gray-300'>{volunteerData.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVolunteerProfile;
