import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar'
import { Users, Calendar, BarChart3, Settings, Plus, Check, X, Copy } from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState({});
    const [events, setEvents] = useState([]);
    const [pendingMembers, setPendingMembers] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [memberSubTab, setMemberSubTab] = useState('active'); // 'active' or 'pending'
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [adminRes, eventsRes, pendingRes, activeMembersRes, statsRes] = await Promise.all([
                    api.get("/my-admin-data/"),
                    api.get("/get-my-events-as-admin/"),
                    api.get("/list_pending_members/"),
                    api.get("/list_organization_members/"),
                    api.get("/analytics/my-organization-stats/")
                ]);

                setAdminData(adminRes.data);
                setEvents(eventsRes.data.events || []);
                setPendingMembers(pendingRes.data || []);
                setActiveMembers(activeMembersRes.data || []);
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
            // Refresh
            const pendingRes = await api.get("/list_pending_members/");
            setPendingMembers(pendingRes.data || []);
        } catch (err) {
            alert("Failed to reject member");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/delete-event/${eventId}/`);
            alert("Event deleted successfully");
            const eventsRes = await api.get("/get-my-events-as-admin/");
            setEvents(eventsRes.data.events || []);
        } catch (err) {
            alert("Failed to delete event");
        }
    };



    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:justify-between lg:items-center gap-4 md:gap-6 lg:gap-4'>
                    <div className='w-full flex flex-col justify-center items-start gap-2 md:gap-4 lg:gap-2'>
                        <h1 className='font-[montserrat] text-white text-4xl md:text-5xl lg:text-5xl font-bold leading-14'>
                            <span className='text-2xl font-medium text-gray-400'>Welcome Back,</span><br />
                            <span className="text-[#9B4DFF] capitalize">{adminData.user?.username && adminData.user.username.includes('@') ? adminData.user.username.split('@')[0] : adminData.user?.username || "Admin"}</span>
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
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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
                                        onClick={() => navigate('/create-event')}
                                        className='bg-[#9B4DFF] px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-[#8B3DFF] transition-colors'
                                    >
                                        <Plus size={20} /> Create Event
                                    </button>
                                </div>
                                {events.length > 0 ? (
                                    <div className='space-y-4'>
                                        {events.map(event => (
                                            <div key={event.id} className='bg-zinc-900 p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                                                <div className='flex-1'>
                                                    <h3 className='font-semibold text-xl text-[#9B4DFF] mb-1'>{event.name}</h3>
                                                    <p className='text-gray-300 mb-2'>{event.description}</p>
                                                    <div className='flex flex-wrap gap-4 text-gray-500 text-sm'>
                                                        <span>📅 {event.date}</span>
                                                        <span>📍 {event.location}</span>
                                                        <span>⏱️ {event.service_hours} Hours</span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-wrap gap-3'>
                                                    <button
                                                        onClick={() => navigate(`/event-participations/${event.id}`)}
                                                        className='bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all'
                                                    >
                                                        <Users size={18} /> Manage
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/update-event/${event.id}`)}
                                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all'
                                                    >
                                                        Settings
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        className='bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all'
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
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
                            <div className='space-y-6'>
                                <div className='flex gap-4 border-b border-zinc-800 pb-2'>
                                    <button
                                        onClick={() => setMemberSubTab('active')}
                                        className={`pb-2 px-2 transition-all cursor-pointer ${memberSubTab === 'active' ? 'text-[#9B4DFF] border-b-2 border-[#9B4DFF]' : 'text-gray-500'}`}
                                    >
                                        Active Members ({activeMembers.length})
                                    </button>
                                    <button
                                        onClick={() => setMemberSubTab('pending')}
                                        className={`pb-2 px-2 transition-all cursor-pointer ${memberSubTab === 'pending' ? 'text-[#9B4DFF] border-b-2 border-[#9B4DFF]' : 'text-gray-500'}`}
                                    >
                                        Pending Approval ({pendingMembers.length})
                                    </button>
                                </div>

                                {memberSubTab === 'pending' ? (
                                    pendingMembers.length > 0 ? (
                                        <div className='space-y-4'>
                                            {pendingMembers.map(member => (
                                                <div key={member.membership_id} className='bg-zinc-900 p-4 rounded-lg flex justify-between items-center'>
                                                    <div>
                                                        <p className='font-semibold'>{member.volunteer_name}</p>
                                                        <p className='text-gray-400 text-sm'>{member.email}</p>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => navigate(`/view-volunteer-profile/${member.volunteer_id}`)}
                                                            className='bg-blue-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700 cursor-pointer'
                                                        >
                                                            Profile
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproveMember(member.membership_id)}
                                                            className='bg-green-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700 cursor-pointer'
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-gray-400'>No pending requests</p>
                                    )
                                ) : (
                                    activeMembers.length > 0 ? (
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            {activeMembers.map(member => (
                                                <div key={member.membership_id} className='bg-zinc-900 p-4 rounded-lg flex justify-between items-center border-l-2 border-[#9B4DFF]'>
                                                    <div>
                                                        <p className='font-semibold text-white'>{member.first_name} {member.last_name || member.volunteer_name}</p>
                                                        <p className='text-gray-500 text-xs'>{member.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/view-volunteer-profile/${member.volunteer_id}`)}
                                                        className='text-[#9B4DFF] text-sm font-medium hover:underline cursor-pointer'
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-gray-400'>No active members yet</p>
                                    )
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className='space-y-6'>
                                <div className='bg-zinc-900 p-6 rounded-lg'>
                                    <h2 className='text-xl font-semibold mb-4'>Organization Info</h2>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className='bg-zinc-800/50 p-4 rounded border border-zinc-700'>
                                            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Organization Name</label>
                                            <p className='text-lg font-medium text-white'>{adminData.organization?.name || 'N/A'}</p>
                                        </div>
                                        <div className='bg-zinc-800/50 p-4 rounded border border-zinc-700 relative'>
                                            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Volunteer Join Code</label>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-lg font-mono font-bold text-[#9B4DFF]'>{adminData.organization?.join_code || 'N/A'}</p>
                                                <button
                                                    onClick={() => handleCopyCode(adminData.organization?.join_code)}
                                                    className='text-gray-400 hover:text-white transition-colors cursor-pointer'
                                                    title='Copy Code'
                                                >
                                                    {copied ? <Check size={18} className='text-green-500' /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                            <p className='text-[10px] text-gray-500 mt-1'>Share this code with volunteers to join your organization</p>
                                            {copied && (
                                                <div className='absolute -top-8 right-0 bg-green-600 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce'>
                                                    Copied!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-wrap gap-3'>
                                    <button
                                        onClick={() => navigate('/update-admin-profile')}
                                        className='bg-zinc-800 px-6 py-2 rounded text-sm font-medium hover:bg-zinc-700 cursor-pointer transition-all border border-zinc-700'
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/update-organization')}
                                        className='bg-[#9B4DFF] px-6 py-2 rounded text-sm font-medium hover:bg-[#8B3DFF] cursor-pointer transition-all'
                                    >
                                        Update Organization
                                    </button>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className='bg-green-600 px-6 py-2 rounded text-sm font-medium hover:bg-green-700 cursor-pointer transition-all'
                                    >
                                        View Analytics
                                    </button>
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
