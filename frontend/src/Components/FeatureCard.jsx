import React from 'react'

const FeatureCard = ({icon:Icon,title,description}) => {
  return (
    <div className='min-h-[30vh] bg-zinc-950 border border-[#9B4DFF]/30 rounded-lg flex flex-col justify-center items-start p-4 gap-4'>
        <h1 className='text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg'><Icon size={42}/></h1>
        <h2 className='font-[montserrat] font-semibold text-gray-200 text-xl lg:text-xl'>{title}</h2>
        <p className='text-gray-400 font-[montserrat]'>{description}</p>
    </div>
  )
}

export default FeatureCard;