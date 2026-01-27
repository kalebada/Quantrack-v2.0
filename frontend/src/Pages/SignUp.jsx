import React, { useState } from 'react';
import { House } from "lucide-react";
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "../api/axios"; 
import logo from "../assets/logo.webp";
import google from "../assets/googlelogo.png";

const SignUp = () => {

  const [isMember, setIsMember] = useState(true);
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  //  FINAL BACKEND INTEGRATION ADDED HERE
 
  const onSubmit = async (data) => {
    try {
      let payload = {
        email: data.email,
        password: data.password,
        confirm_password: data.password,
        role: isMember ? "volunteer" : "admin",
      };

      if (isMember) {
        // volunteer payload
        payload.first_name = data.firstName;
        payload.last_name = data.lastName;
        payload.date_of_birth = data.dob;
        payload.school_or_organization = data.school;
        if (data.code) payload.join_code = data.code;
      } else {
        // admin + team creation payload
        payload.first_name = data.adminfirstname;
        payload.last_name = data.adminlastname;
        payload.organization_name = data.teamname;
        payload.date_of_establishment = data.date;
        payload.registration_number = data.registrationnumber;
        payload.organization_type = data.teamtype;
        payload.website = data.website;
        payload.description = data.mission;

        payload.address = data.address;
        payload.city = data.city;
        payload.country = data.country;

        payload.phone_number = data.phonenumber;
        payload.job_title = data.position;
      }

      const endpoint = "/register/";

      // Use a separate axios instance without credentials for registration
      const registerAxios = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false, // Don't send cookies for registration
      });

      await registerAxios.post(endpoint, payload);

      alert("Account created! Please verify your email.");
      navigate("/verify-email");  
      reset();
    } catch (err) {
      console.log("SIGNUP ERROR:", err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };
  const handleGoogleLogin = () => {
    alert("Google login coming soon!");
  };

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center p-4 text-white'>
      <Link to="/" className='font-montserrat text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4'><House size={28} /></Link>
      <h1 className='w-full flex justify-center items-center mb-2'>
        <img src={logo} alt="" className='w-[20%] md:w-[12%] lg:w-[6%]' />
        <span className='font-[Gued] text-4xl md:text-5xl lg:text-5xl text-white'>Quantrack</span>
      </h1>
      <h2 className='text-white font-[montserrat] text-xl md:text-3xl lg:text-xl font-semibold'>Create Account</h2>
      <h3 className='font-[montserrat] text-gray-400 mb-4 md:text-2xl lg:text-base text-center'>Join Quantrack and start tracking team engagement</h3>

      {/* MEMBER (VOLUNTEER) FORM */}
      {isMember ? (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>

          <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2 text-white font-[montserrat]'>
            <button
              type="button"
              onClick={() => setIsMember(true)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 cursor-pointer ${isMember ? "bg-[#9B4DFF]" : ""}`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setIsMember(false)}
              className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 cursor-pointer ${!isMember ? "bg-[#9B4DFF]" : ""}`}
            >
              Team Admin
            </button>
          </div>

          {/* First name / Last name */}
          <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>First Name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                type="text" placeholder='John'
                className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
              />
              {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className='w-full flex flex-col justify-center items-start gap-2'>
              <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Last Name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text" placeholder='Doe'
                className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
              />
              {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* DOB */}
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Date of birth</label>
            <input
              {...register("dob", { required: "Date Of Birth is required" })}
              type="date"
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.dob && <p className="text-red-400 text-sm">{errors.dob.message}</p>}
          </div>

          {/* School */}
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>School/Organization</label>
            <input
              {...register("school", { required: "School/Organization is required" })}
              type="text" placeholder='school/organization name'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.school && <p className="text-red-400 text-sm">{errors.school.message}</p>}
          </div>

          {/* Email */}
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
              })}
              type="email" placeholder='john@example.com'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" }
              })}
              type="password" placeholder='Enter Password'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          {/* Team Code */}
          <div className='w-full flex flex-col justify-center items-start gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Team Code (Optional)</label>
            <input
              {...register("code")}
              type="text" placeholder='Enter Code To Join Team.'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
          </div>

          {/* Terms */}
          <div className='w-full flex justify-start items-center gap-2'>
            <input {...register("terms", { required: "You must accept the terms" })} type="checkbox" />
            <label className='text-gray-400 text-sm font-[montserrat]'>I agree to the Terms & Conditions and Privacy Policy.</label>
          </div>
          {errors.terms && <p className="text-red-400 text-sm">{errors.terms.message}</p>}

          <button className='w-full py-3 bg-[#9B4DFF] text-white rounded-lg cursor-pointer'>Create Account</button>
        </form>
      ) : (

        
        <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-[70%] lg:w-[40%] flex flex-col justify-center items-center gap-6'>

          <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2'>
            <button type="button" onClick={() => setIsMember(true)} className={`w-full p-2 rounded cursor-pointer ${isMember ? "bg-[#9B4DFF]" : ""}`}>Member</button>
            <button type="button" onClick={() => setIsMember(false)} className={`w-full p-2 rounded cursor-pointer ${!isMember ? "bg-[#9B4DFF]" : ""}`}>Team Admin</button>
          </div>

          <h1 className='w-full text-white font-[montserrat] text-xl'>Team Details</h1>

          {/* Team name */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Team Name</label>
            <input {...register("teamname", { required: "Team name is required" })} type="text" placeholder='Enter team name' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
            {errors.teamname && <p className="text-red-400 text-sm">{errors.teamname.message}</p>}
          </div>

          {/* Date founded + Registration number */}
          <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Date Founded</label>
              <input {...register("date", { required: "Date is required" })} type="date" className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
              {errors.date && <p className="text-red-400 text-sm">{errors.date.message}</p>}
            </div>

            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Registration Number (Optional)</label>
              <input {...register("registrationnumber")} type="number" placeholder='e.g 123456...' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
            </div>
          </div>

          {/* Team Type */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Team Type</label>
            <input {...register("teamtype", { required: "Team type is required" })} type="text" placeholder='e.g Non-profit, Sport team, Club' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
            {errors.teamtype && <p className="text-red-400 text-sm">{errors.teamtype.message}</p>}
          </div>

          {/* Website */}
          <div className='w-full flex flex-col'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Official Website</label>
            <input {...register("website")} type="url" placeholder='https://yoursite.com' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
          </div>

          {/* Mission */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Mission Statement</label>
            <input {...register("mission")} type="text" placeholder='Brief Description Of Your Mission' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
          </div>

          <h1 className='w-full text-white font-[montserrat] text-xl'>Admin Details</h1>

          {/* Admin First / Last name */}
          <div className='w-full flex lg:flex-row flex-col justify-center items-center lg:items-start gap-4'>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat]'>Admin First Name</label>
              <input {...register("adminfirstname", { required: "First Name is required" })} type="text" placeholder='Jane' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
              {errors.adminfirstname && <p className="text-red-400 text-sm">{errors.adminfirstname.message}</p>}
            </div>

            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat]'>Admin Last Name</label>
              <input {...register("adminlastname", { required: "Last Name is required" })} type="text" placeholder='Smith' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
              {errors.adminlastname && <p className="text-red-400 text-sm">{errors.adminlastname.message}</p>}
            </div>
          </div>

          {/* Admin Email */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat]'>Admin Email</label>
            <input {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
            })}
              type="email" placeholder='admin@yourorg.com'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat]'>Phone Number</label>
            <input {...register("phonenumber", {
              required: "Phone Number is required",
              pattern: { value: /^[0-9]{10,15}$/, message: "Enter a valid phone number (10–15 digits)" }
            })}
              type="tel" placeholder='+1 (555) 000-000'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.phonenumber && <p className="text-red-400 text-sm">{errors.phonenumber.message}</p>}
          </div>

          {/* Job title */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat]'>Job Title / Position</label>
            <input {...register("position", { required: "Job Title is required" })} type="text" placeholder='Executive Director' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
            {errors.position && <p className="text-red-400 text-sm">{errors.position.message}</p>}
          </div>

          {/* Admin pwd */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat]'>Password</label>
            <input {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" }
            })}
              type="password" placeholder='Create a password'
              className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg'
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          <h1 className='w-full text-white font-[montserrat] text-xl'>Location</h1>

          {/* Address */}
          <div className='w-full flex flex-col gap-2'>
            <label className='text-white font-[montserrat]'>Registered Address</label>
            <input {...register("address", { required: "Address is required" })} type="text" placeholder='123 Main Street' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
            {errors.address && <p className="text-red-400 text-sm">{errors.address.message}</p>}
          </div>

          {/* City + Country */}
          <div className='w-full flex lg:flex-row flex-col justify-center items-center gap-4'>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat]'>City</label>
              <input {...register("city", { required: "City is required" })} type="text" placeholder='New York' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
              {errors.city && <p className="text-red-400 text-sm">{errors.city.message}</p>}
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-white font-[montserrat]'>Country</label>
              <input {...register("country", { required: "Country is required" })} type="text" placeholder='United States' className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg' />
              {errors.country && <p className="text-red-400 text-sm">{errors.country.message}</p>}
            </div>
          </div>

          {/* Terms */}
          <div className='w-full flex justify-start items-center gap-2'>
            <input {...register("terms1", { required: "You must accept the terms" })} type="checkbox" />
            <label className='text-gray-400 text-sm font-[montserrat]'>I agree to the Terms & Conditions and Privacy Policy.</label>
          </div>
          {errors.terms1 && <p className="text-red-400 text-sm">{errors.terms1.message}</p>}

          {/* Confirm */}
          <div className='w-full flex justify-start items-center gap-2'>
            <input {...register("info", { required: "Confirm your info" })} type="checkbox" />
            <label className='text-gray-400 text-sm font-[montserrat]'>I confirm that all information provided is accurate.</label>
          </div>
          {errors.info && <p className="text-red-400 text-sm">{errors.info.message}</p>}

          <button className='w-full py-3 bg-[#9B4DFF] text-white rounded-lg cursor-pointer'>
            Register Team
          </button>
        </form>
      )}

      {/* Google Button */}
      <p className='text-white font-[montserrat] my-4 text-sm'>Or Continue With</p>
      <button onClick={handleGoogleLogin} className='bg-zinc-900 w-full md:w-[70%] lg:w-[40%] p-3 flex justify-center items-center text-white gap-2 rounded-lg mb-6 cursor-pointer'>
        <img src={google} alt="" className='w-[8%] md:w-[4%] lg:w-[6%]' /> Sign in with Google
      </button>

      {/* Login Link */}
      <p className='font-[montserrat] text-gray-400 text-sm flex gap-2 items-center'>
        <span>Already have an account?</span>
        <span className='text-[#9B4DFF]'><Link to="/login">LogIn</Link></span>
      </p>
    </div>
  );
};

export default SignUp;
