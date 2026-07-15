"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/auth/login", form);
      loginUser(res.data);
      toast.success("Logged in!");
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="mt-3 w-full border p-2 rounded flex items-center justify-center gap-2 hover:bg-slate-50"
      >
        <FaGoogle className="w-4 h-4 text-red-500" />
        Continue with Google
      </button>
      <p className="text-center text-sm text-slate-500 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}