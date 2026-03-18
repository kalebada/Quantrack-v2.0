import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, ArrowLeft } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/create-event/', data);
      alert('Event created successfully!');
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create event');
    }
  };

  return (
    <div className='min-h-screen w-full bg-zinc-950 p-8'>
      <div className='max-w-2xl mx-auto'>
        <button
          onClick={() => navigate('/admin')}
          className='mb-8 bg-zinc-800 px-6 py-3 rounded-lg flex items-center gap-2 text-white hover:bg-zinc-700 transition-colors'
        >
          <ArrowLeft size={20} />
          Back to Admin
        </button>

        <div className='bg-zinc-900 p-8 rounded-xl shadow-2xl'>
          <div className='text-center mb-8'>
            <Plus className='mx-auto mb-4 text-[#9B4DFF] h-16 w-16' />
            <h1 className='text-3xl font-bold text-white font-[montserrat] mb-2'>Create New Event</h1>
            <p className='text-gray-400 text-lg'>Schedule your next volunteer event and track participation</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <label className='block text-white font-medium mb-3 text-lg'>Event Name *</label>
              <input
                {...register('name', { required: 'Event name is required' })}
                className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all'
                placeholder='e.g. Community Beach Cleanup'
              />
              {errors.name && <p className='text-red-400 mt-1 text-sm'>{errors.name.message}</p>}
            </div>

            <div>
              <label className='block text-white font-medium mb-3 text-lg'>Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all resize-vertical'
                placeholder='Describe the event activities, goals, and what volunteers will do...'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-white font-medium mb-3 text-lg'>Date *</label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type='datetime-local'
                  className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all'
                />
                {errors.date && <p className='text-red-400 mt-1 text-sm'>{errors.date.message}</p>}
              </div>

              <div>
                <label className='block text-white font-medium mb-3 text-lg'>Location</label>
                <input
                  {...register('location')}
                  className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all'
                  placeholder='e.g. Central Park or Virtual'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-white font-medium mb-3 text-lg'>Service Hours *</label>
                <input
                  {...register('service_hours', { required: 'Service hours required', min: 0 })}
                  type='number'
                  className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all'
                  placeholder='e.g. 3'
                  min='0'
                  step='0.5'
                />
                {errors.service_hours && <p className='text-red-400 mt-1 text-sm'>{errors.service_hours.message}</p>}
              </div>

              <div>
                <label className='block text-white font-medium mb-3 text-lg'>Max Participants</label>
                <input
                  {...register('max_participants')}
                  type='number'
                  className='w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF] focus:outline-none transition-all'
                  placeholder='Unlimited or e.g. 50'
                  min='0'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-[#9B4DFF] to-[#8B3DFF] text-white py-4 px-8 rounded-lg text-xl font-semibold hover:from-[#8B3DFF] hover:to-[#7A2DDF] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

