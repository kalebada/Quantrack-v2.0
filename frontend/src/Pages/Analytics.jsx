import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { BarChart3, Users, Calendar, TrendingUp, ArrowLeft, Download } from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    volunteerStats: {},
    eventParticipationStats: {},
    organizationStats: {}
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [volunteerRes, eventRes, orgRes] = await Promise.all([
          api.get("/analytics/volunteer-stats/"),
          api.get("/analytics/event-participation-stats/"),
          api.get("/analytics/my-organization-stats/")
        ]);

        setAnalyticsData({
          volunteerStats: volunteerRes.data,
          eventParticipationStats: eventRes.data,
          organizationStats: orgRes.data
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        // Set default empty data if fetch fails
        setAnalyticsData({
          volunteerStats: {},
          eventParticipationStats: {},
          organizationStats: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'quantrack-analytics.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className='h-screen w-full bg-zinc-950 flex justify-center items-center'>
        <div className='text-white'>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className='h-auto w-full'>
      <NavBar />
      <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
        <div className='w-full flex flex-col justify-center items-center gap-4'>
          <div className='w-full flex justify-between items-center'>
            <button
              onClick={() => navigate('/admin')}
              className='bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700'
            >
              <ArrowLeft size={22} /> Back to Admin Dashboard
            </button>

            <button
              onClick={exportData}
              className='bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-[#8B3DFF]'
            >
              <Download size={20} /> Export Data
            </button>
          </div>

          <div className='w-full max-w-7xl'>
            <div className='flex items-center gap-3 mb-8'>
              <BarChart3 size={32} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-4xl font-bold'>Analytics Dashboard</h1>
            </div>

            {/* Organization Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              <div className='bg-zinc-900 p-6 rounded-lg'>
                <div className='flex items-center gap-3 mb-4'>
                  <Users className='text-[#9B4DFF]' size={24} />
                  <h3 className='font-[montserrat] text-white text-lg font-semibold'>Organization Overview</h3>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-400'>Total Unique Volunteers: <span className='text-white font-semibold'>{analyticsData.organizationStats.unique_volunteers || 0}</span></p>
                  <p className='text-gray-400'>Total Events: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_events || 0}</span></p>
                  <p className='text-gray-400'>Total Participations: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_participations || 0}</span></p>
                  <p className='text-gray-400'>Total Service Hours: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_hours || 0}h</span></p>
                </div>
              </div>

              <div className='bg-zinc-900 p-6 rounded-lg'>
                <div className='flex items-center gap-3 mb-4'>
                  <Calendar className='text-[#9B4DFF]' size={24} />
                  <h3 className='font-[montserrat] text-white text-lg font-semibold'>System-wide Stats</h3>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-400'>Total Registered Volunteers: <span className='text-white font-semibold'>{analyticsData.volunteerStats.total_volunteers || 0}</span></p>
                  <p className='text-gray-400'>Total Platform Events: <span className='text-white font-semibold'>{analyticsData.volunteerStats.total_events || 0}</span></p>
                  <p className='text-gray-400'>Total Participations: <span className='text-white font-semibold'>{analyticsData.volunteerStats.total_participations || 0}</span></p>
                </div>
              </div>

              <div className='bg-zinc-900 p-6 rounded-lg'>
                <div className='flex items-center gap-3 mb-4'>
                  <TrendingUp className='text-[#9B4DFF]' size={24} />
                  <h3 className='font-[montserrat] text-white text-lg font-semibold'>Impact Ratios</h3>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-400'>Completion Rate: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_participations ? Math.round((analyticsData.organizationStats.completed_participations / analyticsData.organizationStats.total_participations) * 100) : 0}%</span></p>
                  <p className='text-gray-400'>Avg Hours per Participation: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_participations ? (analyticsData.organizationStats.total_hours / analyticsData.organizationStats.total_participations).toFixed(1) : 0}h</span></p>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Event Participation Stats List */}
              <div className='bg-zinc-900 p-6 rounded-lg'>
                <h3 className='font-[montserrat] text-white text-xl font-semibold mb-4'>Event Performance</h3>
                <div className='space-y-3'>
                  {analyticsData.eventParticipationStats.event_participation_stats ? (
                    analyticsData.eventParticipationStats.event_participation_stats.map((event) => (
                      <div key={event.event_id} className='flex justify-between items-center border-b border-zinc-800 pb-2'>
                        <span className='text-gray-400 truncate max-w-[60%]'>{event.event_name}</span>
                        <div className='flex gap-3 text-xs'>
                          <span className='text-white'>{event.total_participants} Joined</span>
                          <span className='text-green-400'>{event.completed} Done</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-400'>No event data available</p>
                  )}
                </div>
              </div>

              {/* Volunteers per organization chart-like list */}
              <div className='bg-zinc-900 p-6 rounded-lg'>
                <h3 className='font-[montserrat] text-white text-xl font-semibold mb-4'>Global Distribution</h3>
                <div className='space-y-3'>
                  {analyticsData.volunteerStats.volunteers_per_organization ? (
                    analyticsData.volunteerStats.volunteers_per_organization.slice(0, 8).map((item, index) => (
                      <div key={index} className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>{item.organization}</span>
                          <span className='text-white'>{item.volunteer_count}</span>
                        </div>
                        <div className='w-full bg-zinc-800 h-1 rounded-full overflow-hidden'>
                          <div 
                            className='bg-[#9B4DFF] h-full' 
                            style={{ width: `${Math.min(100, (item.volunteer_count / analyticsData.volunteerStats.total_volunteers) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-400'>No distribution data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Volunteer Leaderboard */}
            <div className='mt-8 bg-zinc-900 p-6 rounded-lg'>
              <h3 className='font-[montserrat] text-white text-xl font-semibold mb-4'>Top Volunteers</h3>
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='border-b border-gray-700'>
                      <th className='text-gray-400 font-[montserrat] py-2'>Volunteer</th>
                      <th className='text-gray-400 font-[montserrat] py-2'>Events Participated</th>
                      <th className='text-gray-400 font-[montserrat] py-2'>Service Hours</th>
                      <th className='text-gray-400 font-[montserrat] py-2'>Certificates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.volunteerStats.top_volunteers ? (
                      analyticsData.volunteerStats.top_volunteers.slice(0, 10).map((volunteer, index) => (
                        <tr key={index} className='border-b border-gray-800'>
                          <td className='text-white py-2'>{volunteer.name}</td>
                          <td className='text-white py-2'>{volunteer.events_count}</td>
                          <td className='text-white py-2'>{volunteer.total_hours}</td>
                          <td className='text-white py-2'>{volunteer.certificates_count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className='text-gray-400 py-4 text-center'>No volunteer data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
