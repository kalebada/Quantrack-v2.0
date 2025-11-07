import React, { useState } from 'react';
import { House, LogIn } from "lucide-react";
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import logo from "../assets/logo.webp";
import google from "../assets/googlelogo.png";

const SignUp = () => {

  const [isMember, setIsMember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // send data to backend here (Firebase, API, etc.)
    reset(); // clears form after submit
  }

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center p-4 text-white'>
      <Link to="/" className='font-montserrat text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4'><House size={28} /></Link>
      <h1 className='w-full flex justify-center items-center mb-2'><img src={logo} alt="" className='w-[20%] md:w-[12%] lg:w-[6%]' /><span className='font-[Gued] text-4xl md:text-5xl lg:text-5xl text-white'>Quantrack</span></h1>
      <h2 className='text-white font-[montserrat] text-xl md:text-3xl lg:text-xl font-semibold'>Create Account</h2>
      <h3 className='font-[montserrat] text-gray-400 mb-4 md:text-2xl lg:text-base text-center'>Join Quantrack and start tracking team engagement</h3>
      {
        isMember ?
          (<form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>
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
            <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>First Name</label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  type="text" name="firstName" id="" placeholder='John' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.firstName && (
                  <p className="text-red-400 text-sm font-[montserrat]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Last Name</label>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  type="text" name="lastName" id="" placeholder='Doe' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.lastName && (
                  <p className="text-red-400 text-sm font-[montserrat]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Date of birth</label>
              <input
                {...register("dob", { required: "Date Of Birth is required" })}
                type="date" name="dob" id="" placeholder='Enter d.o.b' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.dob && (
                <p className="text-red-400 text-sm font-[montserrat]">
                  {errors.dob.message}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>School/Organization</label>
              <input
                {...register("school", { required: "School/Organization is required" })}
                type="text" name="school" id="" placeholder='school/organization name ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.school && (
                <p className="text-red-400 text-sm font-[montserrat]">
                  {errors.school.message}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email" name="email" id="" placeholder='john@example.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.email && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.email.message}</p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters",
                  },
                })}
                type="password" name="password" id="" placeholder='Enter Password ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.password && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.password.message}</p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Team Code (Optional)</label>
              <input
                {...register("code")}
                type="text" name="" id="" placeholder='Enter Code To Join Team.' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex justify-start items-center gap-2'>
              <input
                {...register("terms", { required: "You must accept the terms" })}
                type="checkbox" name="terms" id="" placeholder='' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I agree to the Terms & Conditions and Privacy Policy.</label>
            </div>
            <div className='w-full flex justify-start'>
              {errors.terms && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.terms.message}</p>
              )}
            </div>
            <button className='w-full py-3 bg-[#9B4DFF] text-white font-[montserrat] flex items-center justify-center gap-2 rounded-lg md:text-xl lg:text-base'>Create Account</button>
          </form>)
          :
          (<form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>
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
              <input
                {...register("teamname", { required: "Team name is required" })}
                type="text" name="teamname" id="" placeholder='Enter team name' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.teamname && (
                <p className="text-red-400 text-sm font-[montserrat]">
                  {errors.teamname.message}
                </p>
              )}
            </div>
            <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Date Founded</label>
                <input
                  {...register("date", { required: " Date is required" })}
                  type="date" name="date" id="" className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.date && (
                  <p className="text-red-400 text-sm font-[montserrat]">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Registration Number (Optional) </label>
                <input
                  {...register("registrationnumber")}
                  type="number" name="" id="" placeholder='e.g 123456...' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Team Type</label>
              <input
                {...register("teamtype", { required: "Team type is required" })}
                type="text" name="teamtype" id="" placeholder='e.g Non-profit, Sport team, Club' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.teamtype && (
                <p className="text-red-400 text-sm font-[montserrat]">
                  {errors.teamtype.message}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Official Website (Optional)</label>
              <input
                {...register("website")}
                type="url" name="" id="" placeholder='https://yoursite.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Mission Statement (Optional)</label>
              <input
                {...register("mission")}
                type="text" name="" id="" placeholder='Brief Description Of Your Mission. ' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
            </div>
            <h1 className='w-full text-white font-[montserrat] text-xl'>Admin Details</h1>
            <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin First Name</label>
                <input
                  {...register("adminfirstname", { required: "First Name is required" })}
                  type="text" name="adminfirstname" id="" placeholder='jane' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.adminfirstname && (
                  <p className="text-red-400 text-sm font-[montserrat]">
                    {errors.adminfirstname.message}
                  </p>
                )}
              </div>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin Last Name</label>
                <input
                  {...register("adminlastname", { required: "Last Name is required" })}
                  type="text" name="adminlastname" id="" placeholder='smith' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.adminlastname && (
                  <p className="text-red-400 text-sm font-[montserrat]">
                    {errors.adminlastname.message}
                  </p>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Admin email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email" name="email" id="" placeholder='admin@yourorg.com' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.email && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.email.message}</p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Phone Number</label>
              <input
                {...register("phonenumber", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Enter a valid phone number (10–15 digits)",
                  },
                })}
                type="tel" name="phonenumber" id="" placeholder='+1 (555) 000-000' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.phonenumber && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.phonenumber.message}</p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Job Title / Position</label>
              <input
              {...register("position", { required: "Job Title / Position is required" })}
              type="text" name="position" id="" placeholder='Executive Director' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.position && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.position.message}</p>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
              <input
              {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters",
                  },
                })}
              type="password" name="password" id="" placeholder='Create a password (min 8 characters)' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
             {errors.password && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.password.message}</p>
              )}
            </div>
            <h1 className='w-full text-white font-[montserrat] text-xl'>Location</h1>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>Registered Address</label>
              <input
              {...register("address", { required: "Address is required" })}
              type="text" name="address" id="" placeholder='123 Main Street' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              {errors.address && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.address.message}</p>
              )}
            </div>
            <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white  font-[montserrat] md:text-2xl lg:text-lg'>City</label>
                <input
                {...register("city", { required: "City is required" })}
                 type="text" name="city" id="" placeholder='New York' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.city && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.city.message}</p>
              )}
              </div>
              <div className='w-full flex flex-col justify-center items-start gap-2'>
                <label htmlFor="" className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Country</label>
                <input
                {...register("country", { required: "Country is required" })}
                type="text" name="country" id="" placeholder='United States' className='w-full text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
                {errors.country && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.country.message}</p>
              )}
              </div>
            </div>
            <div className='w-full flex justify-start items-center gap-2'>
              <input 
              {...register("terms1", { required: "You must accept the terms" })}
               type="checkbox" name="terms1" id="" placeholder='school/organization name ' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I agree to the Terms & Conditions and Privacy Policy.</label>
            </div>
            <div className='w-full flex justify-start'>
              {errors.terms1 && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.terms1.message}</p>
              )}
            </div>
            <div className='w-full flex justify-start items-center gap-2'>
              <input
              {...register("info", { required: "Confirm your info" })}
               type="checkbox" name="info" id="" placeholder='school/organization name ' className='text-white border border-[#9B4DFF] p-3 md:py-4 lg:py-3 md:text-xl lg:text-base rounded-lg focus:outline-none placeholder:font-[montserrat] placeholder:text-gray-400' />
              <label htmlFor="" className='text-gray-400 text-sm font-[montserrat] md:text-2xl lg:text-lg'>I confirm that all information provided is accurate.</label>
            </div>
            <div className='w-full flex justify-start'>
              {errors.info && (
                <p className="text-red-400 text-sm font-[montserrat]">{errors.info.message}</p>
              )}
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