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
      // ✅ SINGLE API CALL - Login gets tokens AND user info
      const response = await api.post(
        "/token/",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        // ✅ Get role directly from login response
        const userRole = response.data.user.role;
        console.log("User role from login:", userRole);

        // Route based on role
        if (userRole === "admin") {
          console.log("Navigating to admin page");
          navigate("/admin");
        } else if (userRole === "volunteer") {
          console.log("Navigating to volunteer page");
          navigate("/volunteer");
        } else {
          console.log("Unknown role, navigating to volunteer page");
          navigate("/volunteer");
        }
      } else {
        // Handle unsuccessful login
        alert(response.data.error || "Login failed");
      }

    } catch (err) {
      console.error("Login error details:", err);
      
      // More detailed error handling
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.error || 
                            err.response.data?.detail || 
                            err.response.data?.message ||
                            `Login failed (${err.response.status})`;
        alert(errorMessage);
      } else if (err.request) {
        // Request made but no response
        alert("Network error. Please check your connection.");
      } else {
        // Something else went wrong
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login coming soon!");
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center px-4 py-2 relative">
      <Link
        to="/"
        className="text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg absolute top-4 left-4"
      >
        <House size={28} />
      </Link>

      <h1 className="flex items-center gap-2 mb-2">
        <img src={logo} alt="Quantrack" className="w-12" />
        <span className="font-[Gued] text-4xl text-white">Quantrack</span>
      </h1>

      <h2 className="text-white font-[montserrat] text-xl font-semibold">
        Welcome Back
      </h2>
      <p className="text-gray-400 mb-4">
        Sign in to your account to continue.
      </p>

      <form
        onSubmit={handleLogin}
        className="w-full md:w-[70%] lg:w-[32%] flex flex-col gap-6"
      >
        {/* MEMBER / ADMIN SWITCH */}
        <div className="flex bg-zinc-900 rounded-lg p-2 text-white">
          <button
            type="button"
            onClick={() => setIsMember(true)}
            className={`w-full p-2 rounded cursor-pointer transition-colors ${
              isMember ? "bg-[#9B4DFF]" : "hover:bg-zinc-800"
            }`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => setIsMember(false)}
            className={`w-full p-2 rounded cursor-pointer transition-colors ${
              !isMember ? "bg-[#9B4DFF]" : "hover:bg-zinc-800"
            }`}
          >
            Team Admin
          </button>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-white block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#9B4DFF]/50"
            required
            placeholder="Enter your email"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-white block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#9B4DFF]/50"
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/forgotpassword" className="text-[#9B4DFF] hover:text-[#8B3DFF] transition-colors">
            Forgot Password?
          </Link>
          <Link to="/verify-email" className="text-[#9B4DFF] hover:text-[#8B3DFF] transition-colors">
            Verify Email?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-[#9B4DFF] text-white rounded flex justify-center items-center gap-2 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#8B3DFF] active:scale-[0.98] cursor-pointer"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            <>
              Log In <LogIn size={20} />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center w-full md:w-[70%] lg:w-[32%]">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="px-4 text-gray-400 text-sm">Or continue with</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="bg-zinc-900 w-full md:w-[70%] lg:w-[32%] p-3 flex justify-center items-center text-white gap-2 rounded hover:bg-zinc-800 transition-colors active:scale-[0.98] cursor-pointer"
      >
        <img src={google} alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>

      <p className="text-gray-400 text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#9B4DFF] font-medium hover:text-[#8B3DFF] transition-colors">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;