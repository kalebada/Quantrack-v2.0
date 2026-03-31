import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Download, ArrowLeft, Award, Users, Clock, FileText } from 'lucide-react';

const SummaryCertificate = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/my-volunteer-stats/');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const generateSummary = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    
    try {
      const response = await api.post('/summary-report/', {
        start_date: startDate,
        end_date: endDate
      }, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `volunteer-summary-${startDate}-to-${endDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to generate summary certificate', err);
      alert(err.response?.data?.error || "Failed to generate summary certificate. Make sure you have completed participations in the selected range.");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-zinc-950 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading summary...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-zinc-950 p-4 md:p-8'>
      <button
        onClick={() => navigate('/volunteer')}
        className='mb-8 flex items-center gap-2 text-white bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg transition-all font-[montserrat]'
      >
        <ArrowLeft />
        Back to Dashboard
      </button>

      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='text-center'>
          <Award className='mx-auto h-20 w-20 text-[#9B4DFF] mb-6' />
          <h1 className='text-4xl font-bold bg-gradient-to-r from-[#9B4DFF] to-[#8B3DFF] bg-clip-text text-transparent font-[montserrat] mb-4'>
            Volunteer Service Summary
          </h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>Download your comprehensive volunteer service certificate</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-zinc-900 p-8 rounded-2xl text-center border border-zinc-700 hover:border-[#9B4DFF] transition-all group'>
            <Users className='mx-auto h-16 w-16 text-[#9B4DFF] mb-4 group-hover:scale-110 transition-transform' />
            <h3 className='text-2xl font-bold text-white mb-2'>{stats.total_events_joined || 0}</h3>
            <p className='text-gray-400 text-lg'>Events Participated</p>
          </div>

          <div className='bg-zinc-900 p-8 rounded-2xl text-center border border-zinc-700 hover:border-[#9B4DFF] transition-all group'>
            <Clock className='mx-auto h-16 w-16 text-green-400 mb-4 group-hover:scale-110 transition-transform' />
            <h3 className='text-2xl font-bold text-white mb-2'>{stats.hours_completed || 0}h</h3>
            <p className='text-gray-400 text-lg'>Total Service Hours</p>
          </div>

          <div className='bg-zinc-900 p-8 rounded-2xl text-center border border-zinc-700 hover:border-[#9B4DFF] transition-all group'>
            <FileText className='mx-auto h-16 w-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform' />
            <h3 className='text-2xl font-bold text-white mb-2'>{stats.events_completed || 0}</h3>
            <p className='text-gray-400 text-lg'>Events Completed</p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-10 text-center border border-[#9B4DFF]/30 shadow-2xl'>
          <h2 className='text-3xl font-bold text-white mb-6 font-[montserrat]'>Official Service Summary Certificate</h2>
          
          <div className='flex flex-col md:flex-row gap-4 justify-center items-center mb-8'>
            <div className='flex flex-col items-start'>
              <label className='text-gray-400 text-sm mb-1 ml-1'>Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 focus:border-[#9B4DFF] outline-none transition-all'
              />
            </div>
            <div className='flex flex-col items-start'>
              <label className='text-gray-400 text-sm mb-1 ml-1'>End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 focus:border-[#9B4DFF] outline-none transition-all'
              />
            </div>
          </div>

          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Verify your impact with our official summary certificate. Perfect for resumes, applications, and showcasing your community contributions.
          </p>
          <button
            onClick={generateSummary}
            className='bg-gradient-to-r from-[#9B4DFF] to-[#8B3DFF] hover:from-[#8B3DFF] hover:to-[#7A2DDF] text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 font-[montserrat] tracking-wide cursor-pointer'
          >
            <Download className='inline mr-2 h-6 w-6' />
            Download Summary Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCertificate;

