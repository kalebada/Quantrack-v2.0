import React, { useState } from 'react';
import { House, LogIn } from "lucide-react";
import { Link } from 'react-router-dom';

import logo from "../assets/logo.webp";
import google from "../assets/googlelogo.png";

const SignUp = () => {

  const [isMember, setIsMember] = useState(true);

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center p-4 text-white'>
      <Link to="/" className='font-montserrat text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4'><House size={28} /></Link>
      <h1 className='w-full flex justify-center items-center mb-2'><img src={logo} alt="" className='w-[20%] md:w-[12%] lg:w-[6%]' /><span className='font-[Gued] text-4xl md:text-5xl lg:text-5xl text-white'>Quantrack</span></h1>
      <h2 className='text-white font-[montserrat] text-xl md:text-3xl lg:text-xl font-semibold'>Create Account</h2>
      <h3 className='font-[montserrat] text-gray-400 mb-4 md:text-2xl lg:text-base text-center'>Join Quantrack and start tracking team engagement</h3>
      {
        isMember ? 
        (<form className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>
          <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2 text-white font-[montserrat]'>
            <button
              type="button"
              onClick={() => setIsMember(true)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 ${isMember ? "bg-[#9B4DFF]" : ""
                }`}
            >
              Member
            </button>

            <button
              type="button"
              onClick={() => setIsMember(false)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 ${!isMember ? "bg-[#9B4DFF]" : ""
                }`}
            >
              Team Admin
            </button>
          </div>
          <div className='w-full flex lg:flex-row flex-col justify-center items-center gap-4'>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>First Name</label>
              <input type="text" name="" id="" placeholder='John' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Last Name</label>
              <input type="text" name="" id="" placeholder='Doe' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Date of birth</label>
            <input type="date" name="" id="" placeholder='Enter d.o.b' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>School/Organization</label>
            <input type="text" name="" id="" placeholder='school/organization name ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Email</label>
            <input type="email" name="" id="" placeholder='john@example.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
            <input type="password" name="" id="" placeholder='Enter Password ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Team Code (Optional)</label>
            <input type="text" name="" id="" placeholder='Enter Code To Join Team.' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex justify-start items-center gap-2'>
            <input type="checkbox" name="" id="" placeholder='' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I agree to the Terms & Conditions and Privacy Policy.</label>
          </div>
          <button className='w-full py-3 bg-[#9B4DFF] text-white font-[montserrat] flex items-center justify-center gap-2 rounded-lg md:text-xl lg:text-base'>Create Account</button>
        </form>) 
        : 
        (<form className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>
          <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2 text-white font-[montserrat]'>
            <button
              type="button"
              onClick={() => setIsMember(true)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 ${isMember ? "bg-[#9B4DFF]" : ""
                }`}
            >
              Member
            </button>

            <button
              type="button"
              onClick={() => setIsMember(false)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 ${!isMember ? "bg-[#9B4DFF]" : ""
                }`}
            >
              Team Admin
            </button>
          </div>
          <h1 className='w-full text-white font-[montserrat] text-xl'>Team Details</h1>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Team Name</label>
            <input type="text" name="" id="" placeholder='Enter team name' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex lg:flex-row flex-col justify-center items-center gap-4'>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Date Founded</label>
              <input type="date" name="" id="" placeholder='Enter Email' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Registration Number (Optional) </label>
              <input type="number" name="" id="" placeholder='e.g 123456...' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Team Type</label>
            <input type="text" name="" id="" placeholder='e.g Non-profit, Sport team, Club' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Official Website (Optional)</label>
            <input type="url" name="" id="" placeholder='https://yoursite.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Mission Statement (Optional)</label>
            <input type="text" name="" id="" placeholder='Brief Description Of Your Mission. ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <h1 className='w-full text-white font-[montserrat] text-xl'>Admin Details</h1>
          <div className='w-full flex lg:flex-row flex-col justify-center items-center gap-4'>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin First Name</label>
              <input type="text" name="" id="" placeholder='jane' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin Last Name</label>
              <input type="text" name="" id="" placeholder='smith' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin email</label>
            <input type="email" name="" id="" placeholder='admin@yourorg.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Phone Number</label>
            <input type="tel" name="" id="" placeholder='+1 (555) 000-000' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Job Title / Position</label>
            <input type="text" name="" id="" placeholder='Executive Director' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
           <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
            <input type="password" name="" id="" placeholder='Create a password (min 8 characters)' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <h1 className='w-full text-white font-[montserrat] text-xl'>Location</h1>
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Registered Address</label>
            <input type="text" name="" id="" placeholder='123 Main Street' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
          </div>
          <div className='w-full flex lg:flex-row flex-col justify-center items-center gap-4'>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>City</label>
              <input type="text" name="" id="" placeholder='New York' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Country</label>
              <input type="text" name="" id="" placeholder='United States' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
          </div>
          <div className='w-full flex justify-start items-center gap-2'>
            <input type="checkbox" name="" id="" placeholder='school/organization name ' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I agree to the Terms & Conditions and Privacy Policy.</label>
          </div>
          <div className='w-full flex justify-start items-center gap-2'>
            <input type="checkbox" name="" id="" placeholder='school/organization name ' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I confirm that all information provided is accurate.</label>
          </div>
          <button className='w-full py-3 bg-[#9B4DFF] text-white font-[montserrat] flex items-center justify-center gap-2 rounded-lg md:text-xl lg:text-base'>{isMember ? "Create Account" : "Register Team"}</button>
        </form>)
      }

      <p className='text-white font-[montserrat] my-4 text-sm md:text-xl lg:text-sm'>Or Continue With</p>
      <button className='bg-zinc-900 w-full md:w-[70%] lg:w-[40%] p-3 flex justify-center items-center text-white font-[montserrat] gap-2 rounded-lg mb-6 md:text-xl lg:text-base'><img src={google} alt="" className='w-[8%] md:w-[4%] lg:w-[4%]' />Sign in with Google</button>
      <p className='font-[montserrat] text-gray-400 text-sm md:text-xl lg:text-sm flex gap-2 items-center'><span>Already have an account ?</span><span className='text-[#9B4DFF] lg:hover:underline'><Link to="/login">Sign In</Link></span></p>
    </div>
  )
}

export default SignUp