import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { Plus, ArrowLeft } from 'lucide-react';

const JoinOrganization = () => {
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const handleJoinOrganization = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a join code");
      return;
    }

    try {
      setJoining(true);
      await api.post("/organizations/join/", {
        join_code: joinCode,
      });
      alert("Join request sent! Waiting for admin approval.");
      setJoinCode("");
      navigate('/volunteer'); // Redirect back to volunteer page after success
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to join organization"
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className='h-auto w-full'>
      <NavBar />
      <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
        <div className='w-full flex flex-col justify-center items-center gap-4'>
          <button
            onClick={() => navigate('/volunteer')}
            className='self-start bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700'
          >
            <ArrowLeft size={22} /> Back to Volunteer Dashboard
          </button>
          <div className='w-full max-w-md bg-zinc-900 rounded-lg flex flex-col justify-center items-center p-8 gap-4'>
            <div className='flex flex-col justify-center items-center gap-2 mb-4'>
              <Plus size={60} className='text-[#9B4DFF]' />
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>Join New Organization</h1>
            </div>
            <div className='w-full'>
              <label className='text-white font-[montserrat] text-sm mb-2 block'>Enter Join Code</label>
              <input
                type='text'
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className='w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white mb-4'
                placeholder='e.g., ABC12345'
                maxLength={10}
              />
              <button
                onClick={handleJoinOrganization}
                disabled={joining || !joinCode.trim()}
                className='w-full py-3 bg-[#9B4DFF] text-white rounded flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                {joining ? "Joining..." : "Join Organization"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;
