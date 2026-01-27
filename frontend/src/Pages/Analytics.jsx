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
                  <p className='text-gray-400'>Total Members: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_members || 0}</span></p>
                  <p className='text-gray-400'>Active Volunteers: <span className='text-white font-semibold'>{analyticsData.organizationStats.active_volunteers || 0}</span></p>
                  <p className='text-gray-400'>Total Events: <span className='text-white font-semibold'>{analyticsData.organizationStats.total_events || 0}</span></p>
                  <p className='text-gray-400'>Completed Events: <span className='text-white font-semibold'>{analyticsData.organizationStats.completed_events || 0}</span></p>
                </div>
              </div>

              <div className='bg-zinc-900 p-6 rounded-lg'>
                <div className='flex items-center gap-3 mb-4'>
                  <Calendar className='text-[#9B4DFF]' size={24} />
                  <h3 className='font-[montserrat] text-white text-lg font-semibold'>Event Statistics</h3>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-400'>Upcoming Events: <span className='text-white font-semibold'>{analyticsData.eventParticipationStats.upcoming_events || 0}</span></p>
                  <p className='text-gray-400'>Total Participations: <span className='text-white font-semibold'>{analyticsData.eventParticipationStats.total_participations || 0}</span></p>
                  <p className='text-gray-400'>Avg Participants/Event: <span className='text-white font-semibold'>{analyticsData.eventParticipationStats.avg_participants_per_event || 0}</span></p>
                  <p className='text-gray-400'>Completion Rate: <span className='text-white font-semibold'>{analyticsData.eventParticipationStats.completion_rate || 0}%</span></p>
                </div>
              </div>

              <div className='bg-zinc-900 p-6 rounded-lg'>
                <div className='flex items-center gap-3 mb-4'>
                  <TrendingUp className='text-[#9B4DFF]' size={24} />
                  <h3 className='font-[montserrat] text-white text-lg font-semibold'>Volunteer Impact</h3>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-400'>Total Service Hours: <span className='text-white font-semibold'>{analyticsData.volunteerStats.total_service_hours || 0}</span></p>
                  <p className='text-gray-400'>Active Volunteers: <span className='text-white font-semibold'>{analyticsData.volunteerStats.active_volunteers || 0}</span></p>
                  <p className='text-gray-400'>Avg Hours/Volunteer: <span className='text-white font-semibold'>{analyticsData.volunteerStats.avg_hours_per_volunteer || 0}</span></p>
                  <p className='text-gray-400'>Certificates Issued: <span className='text-white font-semibold'>{analyticsData.volunteerStats.certificates_issued || 0}</span></p>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Event Participation Trends */}
              <div className='bg-zinc-900 p-6 rounded-lg'>
                <h3 className='font-[montserrat] text-white text-xl font-semibold mb-4'>Event Participation Trends</h3>
                <div className='space-y-3'>
                  {analyticsData.eventParticipationStats.participation_by_month ? (
                    Object.entries(analyticsData.eventParticipationStats.participation_by_month).map(([month, count]) => (
                      <div key={month} className='flex justify-between items-center'>
                        <span className='text-gray-400'>{month}</span>
                        <span className='text-white font-semibold'>{count} participations</span>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-400'>No participation data available</p>
                  )}
                </div>
              </div>

              {/* Top Performing Events */}
              <div className='bg-zinc-900 p-6 rounded-lg'>
                <h3 className='font-[montserrat] text-white text-xl font-semibold mb-4'>Top Performing Events</h3>
                <div className='space-y-3'>
                  {analyticsData.eventParticipationStats.top_events ? (
                    analyticsData.eventParticipationStats.top_events.slice(0, 5).map((event, index) => (
                      <div key={index} className='flex justify-between items-center'>
                        <span className='text-gray-400 truncate'>{event.name}</span>
                        <span className='text-white font-semibold'>{event.participants} participants</span>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-400'>No event data available</p>
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
