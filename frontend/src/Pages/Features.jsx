import React from 'react'

import {Users,Calendar,Award,TrendingUp,Shield,Zap} from 'lucide-react'
import FeatureCard from '../Components/FeatureCard'

const Features = () => {

const features = [
  {
    id:"f1",
    icon:Users,
    title:"Member Portal",
    description:"Intuitive dashboard for team members to track contributions, view activities, and monitor their engagement."
  },
  {
    id:"f2",
    icon:Calendar,
    title:"Event Management",
    description:"Create, schedule, and track events with QR code-based attendance verification."
  },
  {
    id:"f3",
    icon:Award,
    title:"Certificate System",
    description:"Generate and issue verified service certificates with unique verification codes."
  },
  {
    id:"f4",
    icon:TrendingUp,
    title:"Gamification",
    description:"Level-up system based on participation to motivate and recognize team contributions."
  },
  {
    id:"f5",
    icon:Shield,
    title:"Secure & Verified",
    description:"Team verification system ensures authenticity and builds trust across your organization."
  },
  {
    id:"f6",
    icon:Zap,
    title:"Admin Dashboard",
    description:"Comprehensive tools for team, event, and organization management."
  },
];

  return (
    <div className='min-h-screen bg-zinc-900 w-full flex flex-col justify-start items-start p-4 gap-4 lg:px-8'>
        <h1 className='text-4xl text-white font-[Gued]'>Quantrack Offers</h1>
        <h2 className='text-gray-400 font-[montserrat] w-[90%]'>Everything you need to manage your team effectively.</h2>
        <div className='w-full grid grid-cols-1 lg:grid-cols-3 justify-center items-center mt-4 gap-4 lg:gap-8'>
            {
              features.map((data)=>(
                <FeatureCard key={data.id} icon={data.icon} title={data.title} description={data.description}/>
              ))
            }
        </div>
    </div>
  )
}

export default Features;