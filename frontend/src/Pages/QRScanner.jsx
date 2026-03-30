import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import NavBar from '../Components/NavBar';

const QRScanner = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col'>
      <NavBar />
      <div className='flex-1 flex flex-col justify-center items-center px-4 py-12'>
        <button
          onClick={() => navigate('/volunteer')}
          className='absolute top-24 left-8 bg-zinc-800 px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer text-white hover:bg-zinc-700 transition-all'
        >
          <ArrowLeft size={22} /> Back to Dashboard
        </button>

        <div className='max-w-2xl w-full text-center space-y-8'>
          <div className='relative inline-block'>
            <div className='absolute -inset-4 bg-[#9B4DFF]/20 rounded-full blur-xl animate-pulse'></div>
            <QrCode size={120} className='text-[#9B4DFF] relative' />
          </div>

          <h1 className='text-4xl md:text-5xl font-bold font-[montserrat] text-white'>
            Attendance Scanner
          </h1>
          
          <p className='text-xl text-gray-400 font-[montserrat] max-w-lg mx-auto'>
            Point your camera at the event QR code to automatically log your attendance and verify your service hours.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-12'>
            <div className='bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-[#9B4DFF]/50 transition-all group'>
              <Camera className='h-12 w-12 text-[#9B4DFF] mx-auto mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-semibold text-white mb-2'>Instant Scan</h3>
              <p className='text-gray-500'>High-speed recognition of event-specific attendance codes.</p>
            </div>
            
            <div className='bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-[#9B4DFF]/50 transition-all group'>
              <ShieldCheck className='h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-semibold text-white mb-2'>Secure Log</h3>
              <p className='text-gray-500'>Encrypted verification ensuring your hours are counted accurately.</p>
            </div>
          </div>

          <div className='mt-12 p-6 bg-[#9B4DFF]/10 rounded-xl border border-[#9B4DFF]/20'>
            <p className='text-[#9B4DFF] font-semibold'>
              Feature Coming Soon: Our team is finalizing the secure camera integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
