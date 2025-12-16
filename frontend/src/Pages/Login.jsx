import React, { useState } from "react";
import { House, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.webp";
import google from "../assets/googlelogo.png";

const Login = () => {
  const [isMember, setIsMember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  Login -> get JWT token
      const res = await api.post("/token/", {
        username: email,   // backend requires "username"
        password: password,
      });

      const token = res.data.access;
      if (!token) {
        throw new Error("Login failed: No token received");
      }

      //  Save token for future requests
      localStorage.setItem("authToken", token);

      //  Get authenticated user details
      const me = await api.get("/authenticated/");
      const role = me.data.role;

      if (!role) {
        throw new Error("Unable to fetch user role");
      }

      //  Validate role with selected tab
      if (isMember && role === "admin") {
        alert("This account is Admin. Switch to Team Admin tab.");
        return;
      }
      if (!isMember && role !== "admin") {
        alert("This account is Member. Switch to Member tab.");
        return;
      }

      //  Redirect based on role
      if (role === "admin") navigate("/admin");
      else navigate("/volunteer");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Login failed. Check your email/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login coming soon!");
  };

  return (
    <div className='min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center px-4 py-2 relative'>
      <Link to="/" className='font-montserrat text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4'>
        <House size={28} />
      </Link>

      <h1 className='w-full flex justify-center items-center mb-2'>
        <img src={logo} alt="" className='w-[20%] md:w-[12%] lg:w-[6%]' />
        <span className='font-[Gued] text-4xl md:text-5xl lg:text-5xl text-white'>Quantrack</span>
      </h1>

      <h2 className='text-white font-[montserrat] text-xl md:text-3xl lg:text-xl font-semibold'>Welcome Back</h2>
      <h3 className='font-[montserrat] text-gray-400 mb-4 md:text-2xl lg:text-base'>
        Sign in to your account to continue.
      </h3>

      <form onSubmit={handleLogin} className='w-full md:w-[70%] lg:w-[32%] flex flex-col justify-center items-center gap-6'>
        
        {/* MEMBER / ADMIN SWITCH */}
        <div className='flex justify-center items-center gap-2 w-full bg-zinc-900 rounded-lg p-2 text-white font-[montserrat]'>
          <button
            type="button"
            onClick={() => setIsMember(true)}
            className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300 cursor-pointer ${
              isMember ? "bg-[#9B4DFF]" : ""
            }`}
          >
            Member
          </button>

          <button
            type="button"
            onClick={() => setIsMember(false)}
            className={`w-full p-2 rounded md:text-xl lg:text-base transition-all duration-300  cursor-pointer ${
              !isMember ? "bg-[#9B4DFF]" : ""
            }`}
          >
            Team Admin
          </button>
        </div>

        {/* EMAIL */}
        <div className='w-full flex flex-col justify-center items-start gap-2'>
          <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Email</label>
          <input 
            type="email"
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg placeholder:text-gray-400'
            required
          />
        </div>

        {/* PASSWORD */}
        <div className='w-full flex flex-col justify-center items-start gap-2'>
          <label className='text-white font-[montserrat] md:text-2xl lg:text-lg'>Password</label>
          <input 
            type="password"
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full text-white border border-[#9B4DFF] p-3 rounded-lg placeholder:text-gray-400'
            required
          />
        </div>

        <p className='w-full text-[#9B4DFF] text-end md:text-xl lg:text-base'>
          <Link>Forgot Password ?</Link>
        </p>

        {/* LOGIN BUTTON */}
        <button 
          type="submit"
          disabled={loading}
          className='w-full py-3 bg-[#9B4DFF] text-white flex items-center justify-center gap-2 rounded-lg cursor-pointer'
        >
          {loading ? "Logging in..." : "Log In"}
          <LogIn />
        </button>
      </form>

      <p className='text-white my-4 text-sm md:text-xl lg:text-sm'>Or Continue With</p>

      <button 
        onClick={handleGoogleLogin}
        className='bg-zinc-900 w-full md:w-[70%] lg:w-[32%] p-3 flex justify-center items-center text-white gap-2 rounded-lg mb-6 cursor-pointer'
      >
        <img src={google} alt="" className='w-[8%] md:w-[4%] lg:w-[6%]' />
        Sign in with Google
      </button>

      <p className='text-gray-400 text-sm md:text-xl lg:text-sm flex gap-2 items-center'>
        <span>Don't have an account ?</span>
        <span className='text-[#9B4DFF]'>
          <Link to="/signup">Sign Up</Link>
        </span>
      </p>
    </div>
  );
};

export default Login;
