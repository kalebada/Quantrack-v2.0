import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import NavBar from '../Components/NavBar';
import { ArrowLeft, LogOut, AlertTriangle } from 'lucide-react';

const QuitOrganization = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [quitting, setQuitting] = useState(false);

  const handleQuitOrganization = async () => {
    if (!joinCode.trim()) {
      alert("Please enter the organization join code");
      return;
    }

    if (!confirm("Are you sure you want to leave this organization? This action cannot be undone.")) {
      return;
    }

    try {
      setQuitting(true);
      await api.post("/organizations/quit/", {
        join_code: joinCode,
      });
      alert("You have successfully left the organization.");
      setJoinCode("");
      navigate('/volunteer');
    } catch (err) {
      console.error("Failed to quit organization:", err);
      alert(
        err.response?.data?.error ||
        "Failed to leave organization. Please check the join code."
      );
    } finally {
      setQuitting(false);
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
            <ArrowLeft size={22} /> Back to Dashboard
          </button>

          <div className='w-full max-w-md bg-zinc-900 rounded-lg p-8 gap-4'>
            <div className='flex flex-col justify-center items-center gap-2 mb-6'>
              <div className='bg-red-600 p-3 rounded-full'>
                <AlertTriangle size={30} className='text-white' />
              </div>
              <h1 className='font-[montserrat] text-white text-2xl font-semibold'>Leave Organization</h1>
              <p className='text-gray-400 text-center text-sm'>
                Enter the organization join code to confirm you want to leave
              </p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-white font-[montserrat] text-sm mb-2 block'>Organization Join Code</label>
                <input
                  type='text'
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className='w-full p-3 rounded border border-red-500 bg-transparent text-white'
                  placeholder='e.g., ABC12345'
                  maxLength={10}
                />
              </div>

              <div className='bg-red-900/20 border border-red-500 rounded p-3'>
                <p className='text-red-300 text-sm'>
                  <strong>Warning:</strong> Leaving an organization will remove you from all associated events and you will lose access to organization-specific features.
                </p>
              </div>

              <button
                onClick={handleQuitOrganization}
                disabled={quitting || !joinCode.trim()}
                className='w-full py-3 bg-red-600 text-white rounded flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-red-700'
              >
                {quitting ? "Leaving..." : "Leave Organization"} <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitOrganization;
