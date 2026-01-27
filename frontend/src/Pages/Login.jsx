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
      // Login (sets HttpOnly cookies)
      const loginResponse = await api.post("/token/", {
        email,
        password,
      });

      // Fetch user data to get role
      const userResponse = await api.get("/authenticated/");
      const role = userResponse.data?.role;
      console.log("User role:", role); // Debug log

      // Route based on role
      if (role === "admin") {
        console.log("Navigating to admin page"); // Debug log
        navigate("/admin"); // Assuming admin route exists
      } else if (role === "volunteer") {
        console.log("Navigating to volunteer page"); // Debug log
        navigate("/volunteer");
      } else {
        // Fallback for unknown roles
        console.log("Unknown role, navigating to volunteer page"); // Debug log
        navigate("/volunteer");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Login failed. Please check credentials."
      );
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
            className={`w-full p-2 rounded cursor-pointer ${
              isMember ? "bg-[#9B4DFF]" : ""
            }`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => setIsMember(false)}
            className={`w-full p-2 rounded cursor-pointer ${
              !isMember ? "bg-[#9B4DFF]" : ""
            }`}
          >
            Team Admin
          </button>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border border-[#9B4DFF] bg-transparent text-white"
            required
          />
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/forgotpassword" className="text-[#9B4DFF]">
            Forgot Password?
          </Link>
          <Link to="/verify-email" className="text-[#9B4DFF]">
            Verify Email?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#9B4DFF] text-white rounded flex justify-center items-center gap-2 cursor-pointer"
        >
          {loading ? "Logging in..." : "Log In"} <LogIn />
        </button>
      </form>

      <p className="text-white my-4 text-sm">Or continue with</p>

      <button
        onClick={handleGoogleLogin}
        className="bg-zinc-900 w-full md:w-[70%] lg:w-[32%] p-3 flex justify-center items-center text-white gap-2 rounded cursor-pointer"
      >
        <img src={google} alt="" className="w-5" />
        Sign in with Google
      </button>

      <p className="text-gray-400 text-sm mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-[#9B4DFF]">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
