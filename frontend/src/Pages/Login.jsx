import React from 'react'
import {House,LogIn} from "lucide-react";
import { Link } from 'react-router-dom';

import logo from "../assets/logo.webp";
import google from "../assets/googlelogo.png";

const Login = () => {
  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center px-4 py-2 relative'>
        <Link to="/" className='font-montserrat text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4'><House size={28} /></Link>
        <h1 className='w-full flex justify-center items-center mb-2'><img src={logo} alt="" className='w-[20%] md:w-[12%] lg:w-[6%]' /><span className='font-[Gued] text-4xl md:text-5xl lg:text-5xl text-white'>Quantrack</span></h1>
        <h2 className='text-white font-[montserrat] text-xl md:text-3xl lg:text-xl font-semibold'>Welcome Back</h2>
        <h3 className='font-[montserrat] text-gray-400 mb-4 md:text-2xl lg:text-base'>Sign in to your account to continue.</h3>
        <form action="" className='w-full md:w-[70%] lg:w-[32%] flex flex-col justify-center items-center gap-6'>
          <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2 text-white font-[montserrat]'>
              <button className='w-full bg-[#9B4DFF] p-2 rounded md:text-xl lg:text-base'>Member</button>
              <button className='w-full p-2 md:text-xl lg:text-base'>Team Admin</button>
          </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white text-lg font-[montserrat] md:text-2xl lg:text-lg'>Email</label>
              <input type="email" name="" id="" placeholder='Enter Email' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor=""  className='text-white text-lg font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
              <input type="password" name="" id="" placeholder='Enter Password' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <p className='w-full font-[montserrat] text-[#9B4DFF] text-end md:text-xl lg:text-base'><Link>Forgot Password ?</Link></p>
            <button className='w-full py-3 bg-[#9B4DFF] text-white font-[montserrat] flex items-center justify-center gap-2 rounded-lg md:text-xl lg:text-base'>Log In<LogIn /></button>
        </form>
        <p className='text-white font-[montserrat] my-4 text-sm md:text-xl lg:text-sm'>Or Continue With</p>
        <button className='bg-zinc-900 w-full md:w-[70%] lg:w-[32%] p-3 flex justify-center items-center text-white font-[montserrat] gap-2 rounded-lg mb-6 md:text-xl lg:text-base'><img src={google} alt="" className='w-[8%] md:w-[4%] lg:w-[6%]' />Sign in with Google</button>
        <p className='font-[montserrat] text-gray-400 text-sm md:text-xl lg:text-sm flex gap-2 items-center'><span>Don't have an account ?</span><span className='text-[#9B4DFF] lg:hover:underline'><Link to="/signup">Sign Up</Link></span></p>
    </div>
  )
}

export default Login;