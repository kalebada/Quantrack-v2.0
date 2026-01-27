import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, Save, User } from 'lucide-react';

const UpdateAdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    job_title: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/my-admin-data/");
        setFormData({
          first_name: response.data.user?.first_name || '',
          last_name: response.data.user?.last_name || '',
          phone_number: response.data.phone_number || '',
          job_title: response.data.job_title || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        alert("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch("/update-admin-data/", formData);
      alert("Profile updated successfully!");
      navigate('/admin');
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading...</div>
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

          <div className='w-full max-w-md bg-zinc-900 rounded-lg p-8 gap-4'>
            <div className='flex flex-col justify-center items-center gap-2 mb-6'>
              <User size={60} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>Update Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>First Name</label>
                <input
                  type='text'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter your first name'
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Last Name</label>
                <input
                  type='text'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter your last name'
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Phone Number</label>
                <input
                  type='tel'
                  name='phone_number'
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter your phone number'
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Job Title</label>
                <input
                  type='text'
                  name='job_title'
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter your job title'
                />
              </div>

              <button
                type='submit'
                disabled={saving}
                className='w-full py-3 bg-[#9B4DFF] text-white rounded flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                {saving ? "Saving..." : "Save Changes"} <Save size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdminProfile;
