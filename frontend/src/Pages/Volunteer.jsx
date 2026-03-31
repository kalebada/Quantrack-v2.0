import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar'
import { QrCode, Plus, ClockAlert, CircleCheck, Calendar, BarChart3, Download, Settings, LogOut } from 'lucide-react';

const Volunteer = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Volunteer");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [userData, setUserData] = useState({});
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    console.log("Volunteer component loaded - Version 2.1 (Fixed Profile Link)");
    const fetchUserData = async () => {
      try {
        const [userRes, eventsRes, participationsRes, statsRes] = await Promise.all([
          api.get("/my-volunteer-data/"),
          api.get("/get-my-events-as-volunteer/"),
          api.get("/participations-as-volunteer/"),
          api.get("/analytics/my-volunteer-stats/")
        ]);

        setUserData(userRes.data);
        const user = userRes.data.user;
        let displayName = "Volunteer";

        if (user?.username) {
          // If it's an email, take the part before @
          displayName = user.username.includes('@') ? user.username.split('@')[0] : user.username;
        }

        setUserName(displayName);
        setEvents(eventsRes.data.events || []);
        setParticipations(participationsRes.data.participations || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);



  // JOIN EVENT HANDLER
  const handleJoinEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join/`, {});
      alert("Successfully joined the event!");
      // Refresh
      const [eventsRes, participationsRes] = await Promise.all([
        api.get("/get-my-events-as-volunteer/"),
        api.get("/participations-as-volunteer/")
      ]);
      setEvents(eventsRes.data.events || []);
      setParticipations(participationsRes.data.participations || []);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join event");
    }
  };

  // CANCEL PARTICIPATION HANDLER
  const handleCancelParticipation = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your participation?")) return;
    try {
      await api.delete(`/events/${eventId}/cancel/`);
      alert("Participation cancelled");
      // Refresh
      const [eventsRes, participationsRes] = await Promise.all([
        api.get("/get-my-events-as-volunteer/"),
        api.get("/participations-as-volunteer/")
      ]);
      setEvents(eventsRes.data.events || []);
      setParticipations(participationsRes.data.participations || []);
    } catch (err) {
      alert("Failed to cancel participation");
    }
  };

  // DOWNLOAD CERTIFICATE HANDLER
  const handleDownloadCertificate = async (participationId) => {
    try {
      const response = await api.post(`/generate-certificate/${participationId}/`, {}, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download certificate");
    }
  };

  return (
    <div className='h-auto w-full'>
      <NavBar />
      <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
        <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:justify-between lg:items-center gap-4 md:gap-6 lg:gap-4'>
          <div className='w-full flex flex-col justify-center items-start gap-2 md:gap-4 lg:gap-2'>
            <h1 className='font-[montserrat] text-white text-4xl md:text-5xl lg:text-5xl font-bold leading-14'><span className='text-2xl font-medium text-gray-400'>Welcome Back,</span><br /><span className="text-[#9B4DFF] capitalize">{userName}</span></h1>
            <h2 className='text-gray-400 font-[montserrat] w-[90%] md:text-xl lg:text-base'>Track your engagement and multiply your impact</h2>
          </div>
          <div className='w-full flex flex-wrap justify-start lg:justify-end items-center gap-3 lg:gap-4 text-white md:text-xl lg:text-base'>
            <button className='bg-[#9B4DFF]/10 hover:bg-[#9B4DFF]/20 border border-[#9B4DFF]/50 px-4 py-3 rounded-xl font-[montserrat] flex justify-center items-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#9B4DFF]/10' onClick={() => navigate('/qr-scanner')}><QrCode size={22} className="text-[#9B4DFF]" />QR Code</button>
            <button className='bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/50 px-4 py-3 rounded-xl font-[montserrat] flex justify-center items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/10' onClick={() => navigate('/update-volunteer-profile')}><Settings size={22} className="text-indigo-400" />Edit Profile</button>
            <button className='bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/50 px-4 py-3 rounded-xl font-[montserrat] flex justify-center items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-600/10' onClick={() => navigate('/summary-certificate')}><Download size={22} className="text-emerald-400" />Certificates</button>
            <button className='bg-[#9B4DFF] hover:bg-[#8B3DFF] px-6 py-3 rounded-xl font-[montserrat] font-semibold flex justify-center items-center gap-2 cursor-pointer transition-all shadow-xl shadow-[#9B4DFF]/20' onClick={() => navigate('/join-organization')}><Plus size={22} />Join Organization</button>
          </div>
        </div>
        <div className='w-full flex flex-col justify-start items-start text-white gap-4'>
          <h1 className='font-[montserrat] text-xl md:text-2xl lg:text-2xl'>Track Activities</h1>
          <div className='w-full lg:w-[80%] flex flex-col md:flex-row lg:flex-row justify-center items-start gap-4 lg:gap-8'>
            <div className='w-full flex flex-col justify-center items-start gap-2 mb-4'>
              <h1 className='font-[montserrat] text-lg md:text-xl lg:text-lg font-semibold'>My Participations ({participations.filter(p => p.status === 'pending').length} Pending)</h1>
              <div className='min-h-[40vh] w-full bg-zinc-900 rounded-lg p-4 overflow-y-auto'>
                {participations.length === 0 ? (
                  <div className='flex flex-col justify-center items-center h-full gap-4 text-center'>
                    <CircleCheck className='text-green-500 h-16 w-16' />
                    <p className='text-xl text-gray-400'>No participations yet</p>
                    <p className='text-gray-500'>Join events to get started</p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {participations.map((participation) => (
                      <div key={participation.id} className='bg-zinc-800 p-4 rounded-lg border-l-4' style={{ borderLeftColor: participation.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                        <div className='flex justify-between items-start mb-2'>
                          <div>
                            <h3 className='font-semibold text-white'>{participation.event_name}</h3>
                            <p className='text-gray-500 text-xs'>{new Date(participation.date_participated).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${participation.status === 'completed'
                              ? 'bg-green-600 text-white'
                              : participation.status === 'cancelled'
                              ? 'bg-red-600 text-white'
                              : 'bg-yellow-600 text-white'
                            }`}>
                            {participation.status}
                          </span>
                        </div>
                        
                        <div className='flex gap-2 mt-3'>
                          {participation.status === 'completed' && (
                            <button
                              onClick={() => handleDownloadCertificate(participation.id)}
                              className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1'
                            >
                              <Download size={14} /> Certificate
                            </button>
                          )}
                          
                          {(participation.status === 'pending' || participation.status === 'active' || participation.status === 'joined') && (
                            <button
                              onClick={() => handleCancelParticipation(participation.event)}
                              className='bg-zinc-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-all flex items-center gap-1'
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <h1 className='font-[montserrat] text-lg md:text-xl lg:text-lg font-semibold'>My Organization</h1>
              <div className='min-h-[40vh] w-full bg-zinc-900 rounded-lg p-4'>
                {userData?.organization ? (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h3 className='text-2xl font-bold text-[#9B4DFF]'>{userData.organization.name}</h3>
                      <p className='text-gray-400'>Join Code: <code className='bg-black px-2 py-1 rounded text-sm'>{userData.organization.join_code}</code></p>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-center'>
                      <div className='bg-zinc-800 p-4 rounded-lg'>
                        <p className='text-2xl font-bold text-white'>{stats.total_events_joined || 0}</p>
                        <p className='text-gray-400'>Events Joined</p>
                      </div>
                      <div className='bg-zinc-800 p-4 rounded-lg'>
                        <p className='text-2xl font-bold text-green-400'>{stats.hours_completed || 0}h</p>
                        <p className='text-gray-400'>Service Hours</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/quit-organization')}
                      className='w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors'
                    >
                      Leave Organization
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col justify-center items-center h-full gap-4'>
                    <Plus className='text-gray-500 h-16 w-16' />
                    <p className='text-xl text-gray-400'>No Organization</p>

                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='w-full mt-8 flex flex-col justify-start items-start gap-4'>
            <h1 className='font-[montserrat] text-lg md:text-xl lg:text-lg font-semibold'>Available Events (Discover & Join)</h1>
            <div className='w-full bg-zinc-900 rounded-lg p-6'>
              {events.length === 0 ? (
                <div className='text-gray-500 py-8 text-center'>
                  No upcoming events in your organization at the moment.
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {events
                    .filter(event => !participations.some(p => p.event === event.id))
                    .map((event) => (
                      <div key={event.id} className='bg-zinc-800 p-5 rounded-xl border border-zinc-700 hover:border-[#9B4DFF]/50 transition-all flex flex-col gap-3 shadow-md'>
                        <div className='flex justify-between items-start'>
                          <h3 className='font-bold text-white text-lg'>{event.title}</h3>
                          <span className='bg-[#9B4DFF]/20 text-[#9B4DFF] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider'>Upcoming</span>
                        </div>
                        <p className='text-gray-400 text-sm line-clamp-2'>{event.description}</p>
                        <div className='flex flex-col gap-1 text-xs text-gray-500'>
                          <div className='flex items-center gap-1'><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</div>
                          <div className='flex items-center gap-1'><ClockAlert size={14} /> {event.duration_hours} Hours</div>
                        </div>
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className='mt-2 bg-[#9B4DFF] hover:bg-[#8B3DFF] text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2'
                        >
                          <Plus size={18} /> Join Event
                        </button>
                      </div>
                    ))}
                  {events.filter(event => !participations.some(p => p.event === event.id)).length === 0 && (
                    <div className='col-span-full text-gray-500 py-8 text-center'>
                      Check back later for new opportunities! You're already part of everything upcoming.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Volunteer