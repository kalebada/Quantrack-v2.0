import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { Users, ArrowLeft, CheckCircle, XCircle, Download } from 'lucide-react';

const EventParticipations = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [participations, setParticipations] = useState([]);
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const response = await api.get(`/participations-as-admin/${eventId}/`);
        setParticipations(response.data.participations || []);
        setEventData(response.data.event || {});
      } catch (err) {
        console.error("Failed to fetch participations:", err);
        alert("Failed to load event participations");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchParticipations();
    }
  }, [eventId, navigate]);

  const handleCompleteParticipation = async (participationId) => {
    try {
      await api.patch(`/participations/${participationId}/complete/`, {});
      alert("Participation marked as completed!");

      // Refresh participations
      const response = await api.get(`/participations-as-admin/${eventId}/`);
      setParticipations(response.data.participations || []);
    } catch (err) {
      console.error("Failed to complete participation:", err);
      alert("Failed to complete participation");
    }
  };

  const handleGenerateCertificate = async (participationId) => {
    try {
      const response = await api.get(`/generate-certificate/${participationId}/`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${participationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate certificate:", err);
      alert("Failed to generate certificate");
    }
  };

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading participations...</div>
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

          <div className='w-full max-w-6xl'>
            <div className='flex items-center gap-3 mb-6'>
              <Users size={32} className='text-[#9B4DFF]' />
              <div>
                <h1 className='font-[montserrat] text-white text-3xl font-bold'>Event Participations</h1>
                <p className='text-gray-400 font-[montserrat]'>{eventData.name}</p>
              </div>
            </div>

            {participations.length > 0 ? (
              <div className='space-y-4'>
                {participations.map(participation => (
                  <div key={participation.id} className='bg-zinc-900 p-6 rounded-lg'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <h3 className='font-[montserrat] text-white text-lg font-semibold'>
                          {participation.volunteer_name}
                        </h3>
                        <p className='text-gray-400 text-sm'>{participation.volunteer_email}</p>
                        <p className='text-gray-400 text-sm'>
                          Joined: {new Date(participation.join_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          participation.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : participation.status === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {participation.status}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      {participation.status !== 'completed' && participation.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCompleteParticipation(participation.id)}
                          className='bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700'
                        >
                          <CheckCircle size={16} /> Mark Complete
                        </button>
                      )}

                      {participation.status === 'completed' && (
                        <button
                          onClick={() => handleGenerateCertificate(participation.id)}
                          className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'
                        >
                          <Download size={16} /> Generate Certificate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='bg-zinc-900 p-8 rounded-lg text-center'>
                <Users size={48} className='text-gray-600 mx-auto mb-4' />
                <p className='text-gray-400 font-[montserrat] text-lg'>No participations found for this event</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventParticipations;
