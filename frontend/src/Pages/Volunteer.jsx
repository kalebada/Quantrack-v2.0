import React from 'react'
import NavBar from '../Components/NavBar'
import {QrCode,Plus,ClockAlert,CircleCheck} from 'lucide-react';

const Volunteer = () => {
  return (
    <div className='h-auto w-full'>
        <NavBar/>
        <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-start gap-8 md:gap-16 lg:gap-12 px-4 py-4'>
            <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:justify-between lg:items-center gap-4 md:gap-6 lg:gap-4'>
                <div className='w-full flex flex-col justify-center items-start gap-2 md:gap-4 lg:gap-2'>
                    <h1 className='font-[montserrat] text-white text-4xl md:text-5xl lg:text-5xl font-bold leading-14'><span className='text-2xl'>Welcome Back,</span><br/>John Doe</h1>
                    <h2 className='text-gray-400 font-[montserrat] w-[90%] md:text-xl lg:text-base'>Track your engagement and multiply your impact</h2>
                </div>
                <div className='w-full flex justify-start lg:justify-end items-center gap-2 lg:gap-4 text-white md:text-xl lg:text-base'>
                    <button className=' bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 cursor-pointer'><QrCode size={22} />Code</button>
                    <button className=' bg-[#9B4DFF] px-4 py-2 rounded font-[montserrat] flex justify-center items-center gap-2 size={22} cursor-pointer'><Plus />Join Organization</button>
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
                    <div className='min-h-[40vh] w-full bg-zinc-900 rounded-lg flex flex-col justify-center items-center'>
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