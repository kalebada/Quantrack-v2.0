import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar'
import {QrCode,Plus,ClockAlert,CircleCheck,Calendar,BarChart3,Download,Settings,LogOut} from 'lucide-react';

const Volunteer = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Volunteer");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, eventsRes, participationsRes, statsRes] = await Promise.all([
          api.get("/my-volunteer-data/"),
          api.get("/get-my-events-as-volunteer/"),
          api.get("/participations-as-volunteer/"),
          api.get("/analytics/my-volunteer-stats/")
        ]);

        const firstName = userRes.data.user?.first_name;
        const lastName = userRes.data.user?.last_name;
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : null;
        setUserName(fullName || userRes.data.user?.username || "Volunteer");
        setEvents(eventsRes.data.events || []);
        setParticipations(participationsRes.data.participations || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // Keep default values if fetch fails
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
      // Refresh events
      const eventsRes = await api.get("/get-my-events-as-volunteer/");
      setEvents(eventsRes.data.events || []);
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to join event"
      );
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
        <NavBar/>
        <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
            <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:justify-between lg:items-center gap-4 md:gap-6 lg:gap-4'>
                <div className='w-full flex flex-col justify-center items-start gap-2 md:gap-4 lg:gap-2'>
                    <h1 className='font-[montserrat] text-white text-4xl md:text-5xl lg:text-5xl font-bold leading-14'><span className='text-2xl'>Welcome Back,</span><br/>{userName}</h1>
                    <h2 className='text-gray-400 font-[montserrat] w-[90%] md:text-xl lg:text-base'>Track your engagement and multiply your impact</h2>
                </div>
                <div className='w-full flex justify-start lg:justify-end items-center gap-2 lg:gap-4 text-white md:text-xl lg:text-base'>
                    <button className=' bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer' onClick={() => alert("QR Code feature coming soon!")}>
                        <QrCode size={22} />Code
                    </button>
                    <button className=' bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer' onClick={() => navigate('/join-organization')}><Plus size={22}  />Join Organization</button>
                </div>
            </div>                 
            <div className='w-full flex flex-col justify-start items-start text-white gap-4'>
                <h1 className='font-[montserrat] text-xl md:text-2xl lg:text-2xl'>Track Activities</h1>
                <div className='w-full lg:w-[80%] flex flex-col md:flex-row lg:flex-row justify-center items-start gap-4 lg:gap-8'>
                    <div className='w-full flex flex-col justify-center items-start gap-2 mb-4'>
                    <h1 className='font-[montserrat] text-lg md:text-xl lg:text-lg font-semibold'>My Tasks</h1>
                    <div className='min-h-[40vh] w-full bg-zinc-900 rounded-lg flex flex-col justify-center items-center p-2 relative'>
                        <p className='flex font-[montserrat] items-center gap-2 absolute top-4 right-4 md:text-lg lg:text-base'><ClockAlert /> 0 Pending</p>
                        <p className='font-[montserrat] flex flex-col justify-center items-center gap-2 md:text-xl lg:text-base'>
                            <span><CircleCheck size={60} /></span>
                            <span>No Pending Tasks</span>
                        </p>
                    </div>
                </div>
                <div className='w-full flex flex-col justify-center items-start gap-2'>
                    <h1 className='font-[montserrat] text-lg md:text-xl lg:text-lg font-semibold'>My Organization</h1>
                    <div className='min-h-[40vh] w-full bg-zinc-900 rounded-lg flex flex-col justify-center items-center p-4'>
                        <p className='font-[montserrat] flex flex-col justify-center items-center gap-2 md:text-xl lg:text-base'>
                            <span><Plus size={60} /></span>
                            <span>Join New Organization</span>
                        </p>
                    </div>
                </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Volunteer