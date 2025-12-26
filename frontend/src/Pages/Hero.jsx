import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className='min-h-[90vh] w-full bg-zinc-950 flex flex-col justify-center items-center lg:items-start px-4 gap-2 lg:px-8 lg:gap-4'>
        <h1 className='text-white font-[Gued] text-[14vw] lg:text-[6vw] flex flex-col'><span className='text-[#9B4DFF] font-medium'>Quantifying Engagement,</span>
        <span>Multiplying Impact</span></h1>
        <h2 className='text-gray-400 font-[montserrat] lg:text-lg lg:w-[50%]'>Quantrack transforms how teams track participation and engagement. Monitor contributions, issue certificates, and amplify your collective impact.</h2>
        <div className='flex justify-center items-center gap-2 lg:gap-4 font-[montserrat] mt-4 '>
            <button onClick={() => navigate('/features')}  className='bg-zinc-700 text-white px-4 py-2 rounded cursor-pointer'>Learn More</button>
            <button  onClick={() => navigate('/login')}  className='bg-[#9B4DFF] text-white px-4 py-2 rounded cursor-pointer'>Start Tracking</button>
        </div>
    </div>
  )
}

export default Hero