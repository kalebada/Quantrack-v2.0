import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { Calendar, ArrowLeft, Save } from 'lucide-react';

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    service_hours: '',
    max_participants: ''
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Get event data - we'll need to add this endpoint to backend
        const response = await api.get(`/events/${eventId}/`);
        const event = response.data;
        setFormData({
          name: event.name || '',
          description: event.description || '',
          date: event.date || '',
          location: event.location || '',
          service_hours: event.service_hours || '',
          max_participants: event.max_participants || ''
        });
      } catch (err) {
        console.error("Failed to fetch event data:", err);
        alert("Failed to load event data");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, navigate]);

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
      await api.patch(`/update-event/${eventId}/`, formData);
      alert("Event updated successfully!");
      navigate('/admin');
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/delete-event/${eventId}/`);
      alert("Event deleted successfully!");
      navigate('/admin');
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading event data...</div>
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
            <ArrowLeft size={22} /> Back to Admin Dashboard
          </button>

          <div className='w-full max-w-2xl bg-zinc-900 rounded-lg p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <Calendar size={32} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-3xl font-bold'>Update Event</h1>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-white font-[montserrat] text-sm mb-2'>Event Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                  required
                />
              </div>

              <div>
                <label className='block text-white font-[montserrat] text-sm mb-2'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white h-32 resize-none'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white font-[montserrat] text-sm mb-2'>Date</label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    required
                  />
                </div>

                <div>
                  <label className='block text-white font-[montserrat] text-sm mb-2'>Location</label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white font-[montserrat] text-sm mb-2'>Service Hours</label>
                  <input
                    type='number'
                    name='service_hours'
                    value={formData.service_hours}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    min='0'
                    step='0.5'
                    required
                  />
                </div>

                <div>
                  <label className='block text-white font-[montserrat] text-sm mb-2'>Max Participants (leave empty for unlimited)</label>
                  <input
                    type='number'
                    name='max_participants'
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white'
                    min='1'
                  />
                </div>
              </div>

              <div className='flex gap-4 pt-4'>
                <button
                  type='submit'
                  disabled={saving}
                  className='flex-1 bg-[#9B4DFF] text-white py-3 rounded flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {saving ? "Saving..." : <><Save size={20} /> Save Changes</>}
                </button>

                <button
                  type='button'
                  onClick={handleDelete}
                  className='px-6 bg-red-600 text-white py-3 rounded hover:bg-red-700'
                >
                  Delete Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;
