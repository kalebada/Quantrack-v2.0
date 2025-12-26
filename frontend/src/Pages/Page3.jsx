import React from 'react'
import { useNavigate } from "react-router-dom";


const Page3 = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center p-4'>
        <div className='w-full h-auto  flex flex-col justify-center items-center gap-6 lg:gap-10 font-[montserrat] p-2'>
            <h1 className='text-white text-4xl lg:text-5xl text-center font-semibold'>Ready to Transform Your Team?</h1>
            <p className='text-gray-400 text-center lg:text-lg lg:w-[50%]'>Join Quantrack today and experience the future of engagement tracking. Get started in minutes.</p>
            <button onClick={() => navigate("/signup")}
             className='bg-[#9B4DFF] font-semibold text-white px-4 py-2 rounded cursor-pointer'>Create Free Account</button>
        </div>
    </div>
  )
}

export default Page3