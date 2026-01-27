import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar'
import {Users,Calendar,BarChart3,Settings,Plus,Check, X} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  const [events, setEvents] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [adminRes, eventsRes, pendingRes, statsRes] = await Promise.all([
          api.get("/my-admin-data/"),
          api.get("/get-my-events-as-admin/"),
          api.get("/list_pending_members/"),
          api.get("/analytics/my-admin-stats/")
        ]);

        setAdminData(adminRes.data);
        setEvents(eventsRes.data.events || []);
        setPendingMembers(pendingRes.data || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleApproveMember = async (membershipId) => {
    try {
      await api.patch(`/approve_membership/${membershipId}/`, {});
      alert("Member approved successfully!");
      // Refresh pending members
      const pendingRes = await api.get("/list_pending_members/");
      setPendingMembers(pendingRes.data || []);
    } catch (err) {
      alert("Failed to approve member");
    }
  };

  const handleRejectMember = async (membershipId) => {
    try {
      await api.patch(`/reject_membership/${membershipId}/`, {});
      alert("Member rejected");
      // Refresh pending members
      const pendingRes = await api.get("/list_pending_members/");
      setPendingMembers(pendingRes.data || []);
    } catch (err) {
      alert("Failed to reject member");
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await api.post("/create-event/", eventData);
      alert("Event created successfully!");
      // Refresh events
      const eventsRes = await api.get("/get-my-events-as-admin/");
      setEvents(eventsRes.data.events || []);
    } catch (err) {
      alert("Failed to create event");
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
        <NavBar/>
        <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
            <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:justify-between lg:items-center gap-4 md:gap-6 lg:gap-4'>
                <div className='w-full flex flex-col justify-center items-start gap-2 md:gap-4 lg:gap-2'>
                    <h1 className='font-[montserrat] text-white text-4xl md:text-5xl lg:text-5xl font-bold leading-14'>
                        <span className='text-2xl'>Welcome Back,</span><br/>
                        {adminData.user?.username || "Admin"}
                    </h1>
                    <h2 className='text-gray-400 font-[montserrat] w-[90%] md:text-xl lg:text-base'>
                        Manage your organization and track volunteer engagement
                    </h2>
                </div>
            </div>

            <div className='w-full flex flex-col justify-start items-start text-white gap-4'>
                <h1 className='font-[montserrat] text-xl md:text-2xl lg:text-2xl'>Admin Dashboard</h1>

                {/* Tab Navigation */}
                <div className='flex gap-4 mb-4'>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded font-[montserrat] flex items-center gap-2 cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#9B4DFF] text-white' : 'bg-zinc-800 text-gray-400'}`}
                    >
                        <BarChart3 size={20} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-4 py-2 rounded font-[montserrat] flex items-center gap-2 cursor-pointer ${activeTab === 'events' ? 'bg-[#9B4DFF] text-white' : 'bg-zinc-800 text-gray-400'}`}
                    >
                        <Calendar size={20} /> Events
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-4 py-2 rounded font-[montserrat] flex items-center gap-2 cursor-pointer ${activeTab === 'members' ? 'bg-[#9B4DFF] text-white' : 'bg-zinc-800 text-gray-400'}`}
                    >
                        <Users size={20} /> Members
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded font-[montserrat] flex items-center gap-2 cursor-pointer ${activeTab === 'settings' ? 'bg-[#9B4DFF] text-white' : 'bg-zinc-800 text-gray-400'}`}
                    >
                        <Settings size={20} /> Settings
                    </button>
                </div>

                <div className='w-full lg:w-[80%]'>
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-zinc-900 p-6 rounded-lg'>
                                <h3 className='text-2xl font-bold text-[#9B4DFF]'>{stats.total_events_managed || 0}</h3>
                                <p className='text-gray-400'>Events Managed</p>
                            </div>
                            <div className='bg-zinc-900 p-6 rounded-lg'>
                                <h3 className='text-2xl font-bold text-[#9B4DFF]'>{stats.total_participations || 0}</h3>
                                <p className='text-gray-400'>Total Participations</p>
                            </div>
                            <div className='bg-zinc-900 p-6 rounded-lg'>
                                <h3 className='text-2xl font-bold text-[#9B4DFF]'>{stats.completed_participations || 0}</h3>
                                <p className='text-gray-400'>Completed Events</p>
                            </div>
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-xl font-semibold'>Organization Events</h2>
                                <button
                                    onClick={() => alert("Create Event functionality coming soon!")}
                                    className='bg-[#9B4DFF] px-4 py-2 rounded flex items-center gap-2 cursor-pointer'
                                >
                                    <Plus size={20} /> Create Event
                                </button>
                            </div>
                            {events.length > 0 ? (
                                <div className='space-y-4'>
                                    {events.map(event => (
                                        <div key={event.id} className='bg-zinc-900 p-4 rounded-lg'>
                                            <h3 className='font-semibold text-lg'>{event.name}</h3>
                                            <p className='text-gray-400'>{event.description}</p>
                                            <p className='text-gray-400 text-sm'>Date: {event.date} | Location: {event.location}</p>
                                            <p className='text-gray-400 text-sm'>Hours: {event.service_hours} | Max Participants: {event.max_participants || 'Unlimited'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-400'>No events created yet</p>
                            )}
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className='space-y-4'>
                            <h2 className='text-xl font-semibold'>Pending Membership Requests</h2>
                            {pendingMembers.length > 0 ? (
                                <div className='space-y-4'>
                                    {pendingMembers.map(member => (
                                        <div key={member.membership_id} className='bg-zinc-900 p-4 rounded-lg flex justify-between items-center'>
                                            <div>
                                                <p className='font-semibold'>{member.volunteer_name}</p>
                                                <p className='text-gray-400 text-sm'>{member.email}</p>
                                                <p className='text-gray-400 text-sm'>Joined: {new Date(member.join_date).toLocaleDateString()}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => navigate(`/view-volunteer/${member.volunteer_id}`)}
                                                    className='bg-blue-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700 cursor-pointer'
                                                >
                                                    View Profile
                                                </button>
                                                <button
                                                    onClick={() => handleApproveMember(member.membership_id)}
                                                    className='bg-green-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700 cursor-pointer'
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectMember(member.membership_id)}
                                                    className='bg-red-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700 cursor-pointer'
                                                >
                                                    <X size={16} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-400'>No pending membership requests</p>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className='bg-zinc-900 p-6 rounded-lg'>
                            <h2 className='text-xl font-semibold mb-4'>Organization Settings</h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Organization Name</label>
                                    <input
                                        type='text'
                                        value={adminData.organization?.name || ''}
                                        className='w-full p-3 rounded border border-[#9B4DFF] bg-zinc-800 text-white'
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Join Code</label>
                                    <input
                                        type='text'
                                        value={adminData.organization?.join_code || ''}
                                        className='w-full p-3 rounded border border-[#9B4DFF] bg-zinc-800 text-white'
                                        readOnly
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => navigate('/update-admin-profile')}
                                        className='bg-blue-600 px-4 py-2 rounded cursor-pointer hover:bg-blue-700'
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/update-organization')}
                                        className='bg-[#9B4DFF] px-4 py-2 rounded cursor-pointer'
                                    >
                                        Update Organization
                                    </button>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className='bg-green-600 px-4 py-2 rounded cursor-pointer hover:bg-green-700'
                                    >
                                        View Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Admin;
