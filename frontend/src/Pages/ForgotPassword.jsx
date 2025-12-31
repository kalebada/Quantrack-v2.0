import { useState } from "react";
import { Link } from "react-router-dom";
import { House, Mail } from "lucide-react";
import api from "../api/axios";
import logo from "../assets/logo.webp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/password-reset/", { email });
      alert("Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Unable to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col justify-center items-center px-4">

      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 text-[#9B4DFF] bg-[#9B4DFF]/10 p-2 rounded-lg"
      >
        <House size={26} />
      </Link>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src={logo} alt="Quantrack" className="w-12" />
        <h1 className="font-[Gued] text-4xl text-white">Quantrack</h1>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 w-full max-w-md rounded-xl p-6 flex flex-col gap-5 shadow-lg"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-sm text-center">
          Enter your registered email and we’ll send you a password reset link.
        </p>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-[montserrat]">Email Address</label>
          <div className="flex items-center bg-zinc-800 rounded-lg px-3">
            <Mail className="text-gray-400 mr-2" size={20} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-white p-3 outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#9B4DFF] py-3 rounded-lg text-white font-semibold hover:opacity-90 transition cursor-pointer"
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>

        {/* Back to login */}
        <p className="text-center text-gray-400 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-[#9B4DFF] font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
