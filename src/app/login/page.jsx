"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
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
        <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" />
        <input type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <button onClick={handleGoogleSignIn} className="mt-3 w-full border p-2 rounded">
        Continue with Google
      </button>
    </div>
  );
}