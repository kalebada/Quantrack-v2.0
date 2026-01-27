import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, Building, Save } from 'lucide-react';

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_establishment: '',
    registration_number: '',
    organization_type: 'Non-profit',
    website: '',
    description: '',
    address: '',
    city: '',
    country: ''
  });

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
      await api.post("/register-organization/", formData);
      alert("Organization registered successfully!");
      navigate('/admin');
    } catch (err) {
      console.error("Failed to register organization:", err);
      alert("Failed to register organization. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
            <div className='flex flex-col justify-center items-center gap-2 mb-6'>
              <Building size={60} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>Register New Organization</h1>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>Organization Name *</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    placeholder='Enter organization name'
                    required
                  />
                </div>

                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>Date of Establishment</label>
                  <input
                    type='date'
                    name='date_of_establishment'
                    value={formData.date_of_establishment}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>Registration Number</label>
                  <input
                    type='text'
                    name='registration_number'
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    placeholder='Enter registration number'
                  />
                </div>

                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>Organization Type</label>
                  <select
                    name='organization_type'
                    value={formData.organization_type}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  >
                    <option value='Non-profit'>Non-profit</option>
                    <option value='For-profit'>For-profit</option>
                    <option value='Government'>Government</option>
                    <option value='Educational'>Educational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Website</label>
                <input
                  type='url'
                  name='website'
                  value={formData.website}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='https://example.com'
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Describe your organization'
                  rows={3}
                />
              </div>

              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Address</label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  placeholder='Enter full address'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    placeholder='Enter city'
                  />
                </div>

                <div>
                  <label className='text-white font-[montserrat] text-sm mb-2 block'>Country</label>
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    placeholder='Enter country'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={saving}
                className='w-full py-3 bg-[#9B4DFF] text-white rounded flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                {saving ? "Registering..." : "Register Organization"} <Save size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganization;
