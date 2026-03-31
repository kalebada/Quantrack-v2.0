import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, Save, User, QrCode, Download, Plus } from 'lucide-react';

const UpdateVolunteerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school_or_organization: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/my-volunteer-data/");
        setUserData(response.data);
        setFormData({
          first_name: response.data.user?.first_name || '',
          last_name: response.data.user?.last_name || '',
          school_or_organization: response.data.school_or_organization || ''
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
      await api.patch("/update-volunteer-data/", formData);
      alert("Profile updated successfully!");
      navigate('/volunteer');
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
      <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-center gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
        <div className='w-full flex flex-col lg:flex-row items-center justify-between gap-4'>
          <button
            onClick={() => navigate('/volunteer')}
            className='bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700 transition-all'
          >
            <ArrowLeft size={22} /> Back to Dashboard
          </button>
          
          <div className='flex flex-wrap justify-center lg:justify-end items-center gap-2 lg:gap-4 text-white'>
            <button className='bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded font-[montserrat] text-sm flex justify-center items-center gap-2 cursor-pointer transition-all' onClick={() => navigate('/qr-scanner')}><QrCode size={18} className="text-[#9B4DFF]" />QR Code</button>
            <button className='bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded font-[montserrat] text-sm flex justify-center items-center gap-2 cursor-pointer transition-all' onClick={() => navigate('/summary-certificate')}><Download size={18} className="text-green-400" />Certificates</button>
            <button className=' bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] text-sm flex justify-center items-center gap-2 cursor-pointer transition-all' onClick={() => navigate('/join-organization')}><Plus size={18} />Join Organization</button>
          </div>
        </div>

        <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
          {/* Update Form */}
          <div className='w-full bg-zinc-900 rounded-lg p-8'>
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
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white focus:outline-none'
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
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white focus:outline-none'
                  placeholder='Enter your last name'
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>School/Organization</label>
                <input
                  type='text'
                  name='school_or_organization'
                  value={formData.school_or_organization}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white focus:outline-none'
                  placeholder='Enter your school or organization'
                />
              </div>

              <button
                type='submit'
                disabled={saving}
                className='w-full py-3 bg-[#9B4DFF] text-white rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#8B3DFF] transition-all font-semibold'
              >
                {saving ? "Saving..." : "Save Changes"} <Save size={20} />
              </button>
            </form>
          </div>

          {/* Organization History */}
          <div className='w-full bg-zinc-900 rounded-lg p-8'>
            <div className='flex flex-col justify-center items-center gap-2 mb-6'>
              <Plus size={60} className='text-indigo-400' />
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>Joined Organizations</h1>
            </div>

            <div className='space-y-4'>
              {!userData.memberships || userData.memberships.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>You haven't joined any organizations yet.</p>
                </div>
              ) : (
                userData.memberships.map((membership, index) => (
                  <div key={index} className='bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-between items-center'>
                    <div>
                      <h4 className='font-bold text-white'>{membership.organization_name}</h4>
                      <p className='text-xs text-gray-500'>Joined: {new Date(membership.join_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      (membership.status === 'pending' || membership.status === 'active' || membership.status === 'joined') ? 'bg-green-600/20 text-green-400 border border-green-600/40' : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/40'
                    }`}>
                      {membership.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            <div className='mt-8 pt-6 border-t border-zinc-800'>
              <p className='text-xs text-gray-500 leading-relaxed'>
                To join a new organization, go back to the dashboard and click the "Join Organization" button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateVolunteerProfile;
