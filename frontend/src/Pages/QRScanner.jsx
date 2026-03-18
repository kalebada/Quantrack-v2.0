import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import jsQR from 'jsqr';
import QRCode from 'qrcode.react';
import { QrCode, Camera, CheckCircle, ArrowLeft, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [stream, setStream] = useState(null);
  const [tab, setTab] = useState('scanner'); // 'scanner' or 'generator'
  const [eventId, setEventId] = useState('');
  const [myParticipations, setMyParticipations] = useState([]);

  useEffect(() => {
    // Fetch my participations for QR generator
    const fetchParticipations = async () => {
      try {
        const res = await api.get('/participations-as-volunteer/');
        setMyParticipations(res.data.participations || []);
      } catch (err) {
        toast.error('Failed to load participations');
      }
    };
    if (tab === 'generator') fetchParticipations();
  }, [tab]);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      setStream(stream);
      setScanning(true);
      videoRef.current.play();
      requestAnimationFrame(tick);
    } catch (err) {
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  };

  const tick = useCallback(() => {
    if (videoRef.current.readyState === videoRef.current.videoReadyState) {
      const canvas = canvasRef.current;
      canvas.height = videoRef.current.videoHeight;
      canvas.width = videoRef.current.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setScanResult(code.data);
        toast.success('QR scanned! Verify participation.');
      }
    }
    if (scanning) requestAnimationFrame(tick);
  }, [scanning]);

  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
    setScanResult('');
  };

  const verifyParticipation = async () => {
    if (!scanResult) return toast.error('No QR scanned');
    try {
      await api.patch(`/participations/${scanResult}/complete/`);
      toast.success('Participation verified and completed!');
      setScanResult('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid participation QR');
    }
  };

  const downloadQR = (participationId) => {
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, participationId, { width: 256 });
    const link = document.createElement('a');
    link.download = `qr-${participationId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className='min-h-screen w-full bg-zinc-950 p-6 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <button
          onClick={() => navigate('/volunteer')}
          className='mb-6 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg flex items-center gap-2 text-white transition-colors'
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div className='bg-zinc-900 rounded-2xl p-8 flex flex-col items-center space-y-4'>
            <QrCode className='text-[#9B4DFF] h-12 w-12' />
            <h1 className='text-2xl font-bold text-white font-[montserrat]'>QR Scanner</h1>
            <div className='text-gray-400 text-center'>Scan participation QR to mark complete</div>
            <div className={`p-1 rounded-lg transition-all ${tab === 'scanner' ? 'bg-[#9B4DFF]' : 'bg-zinc-800'}`}>
              <button onClick={() => setTab('scanner')} className='px-6 py-3 rounded font-semibold'>Scanner</button>
            </div>
          </div>
          <div className='bg-zinc-900 rounded-2xl p-8 flex flex-col items-center space-y-4'>
            <QrCode className='text-[#9B4DFF] h-12 w-12' />
            <h1 className='text-2xl font-bold text-white font-[montserrat]'>QR Generator</h1>
            <div className='text-gray-400 text-center'>Generate QR for your participations</div>
            <div className={`p-1 rounded-lg transition-all ${tab === 'generator' ? 'bg-[#9B4DFF]' : 'bg-zinc-800'}`}>
              <button onClick={() => setTab('generator')} className='px-6 py-3 rounded font-semibold'>Generator</button>
            </div>
          </div>
        </div>

        {tab === 'scanner' && (
          <div className='bg-zinc-900 rounded-2xl p-8 space-y-6'>
            <div className='flex flex-col md:flex-row gap-6 items-center'>
              <div className='relative'>
                <video ref={videoRef} className='w-80 h-80 md:w-96 md:h-96 rounded-xl object-cover' style={{ display: scanning ? 'block' : 'none' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {!scanning && (
                  <div className='w-80 h-80 md:w-96 md:h-96 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border-4 border-dashed border-zinc-600 border-4'>
                    <Camera className='text-gray-500 h-16 w-16 mb-4' />
                    <p className='text-gray-400 font-[montserrat] text-lg text-center'>Point camera at QR code</p>
                    <button
                      onClick={startScanner}
                      className='mt-4 bg-[#9B4DFF] hover:bg-[#8B3DFF] text-white px-6 py-2 rounded-lg font-semibold transition-colors'
                    >
                      Start Scanner
                    </button>
                  </div>
                )}
              </div>
              <div className='flex-1 space-y-4'>
                <div className='bg-zinc-800 p-4 rounded-lg'>
                  <label className='block text-white font-medium mb-2'>Scanned Code</label>
                  <div className='bg-black p-3 rounded text-center font-mono text-lg min-h-[60px] flex items-center justify-center'>
                    {scanResult || 'No code scanned'}
                  </div>
                </div>
                <button
                  onClick={verifyParticipation}
                  disabled={!scanResult}
                  className='w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed'
                >
                  <CheckCircle size={20} />
                  Verify & Complete Participation
                </button>
                {scanning && (
                  <button
                    onClick={stopScanner}
                    className='w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors'
                  >
                    Stop Scanner
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'generator' && (
          <div className='space-y-6'>
            <div className='bg-zinc-900 rounded-2xl p-8'>
              <h2 className='text-2xl font-bold text-white mb-6 font-[montserrat]'>Generate Participation QRs</h2>
              {myParticipations.length === 0 ? (
                <div className='text-center py-12'>
                  <QrCode className='mx-auto text-gray-500 h-16 w-16 mb-4' />
                  <p className='text-gray-400 text-xl'>No participations to generate QR for</p>
                  <p className='text-gray-500 mt-2'>Join some events first!</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {myParticipations.slice(0, 9).map((participation) => (
                    <div key={participation.id} className='bg-zinc-800 p-6 rounded-xl text-center space-y-3 border hover:border-[#9B4DFF] transition-colors'>
                      <div className='bg-white p-2 rounded-lg mx-auto w-fit'>
                        <QRCode value={participation.id} size={128} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-white text-lg'>{participation.event_name}</h3>
                        <p className='text-gray-400 text-sm'>{new Date(participation.created_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => downloadQR(participation.id)}
                        className='w-full bg-[#9B4DFF] hover:bg-[#8B3DFF] text-white py-2 px-4 rounded-lg font-semibold transition-colors'
                      >
                        <Download size={16} className='inline mr-1' />
                        Download QR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
