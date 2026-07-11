"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    role: "Supporter",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/auth/register", form);
      loginUser(res.data);
      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" required onChange={handleChange} className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="border p-2 rounded" />
        <input name="photoURL" placeholder="Profile Picture URL" onChange={handleChange} className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="border p-2 rounded" />
        <select name="role" onChange={handleChange} className="border p-2 rounded">
          <option value="Supporter">Supporter</option>
          <option value="Creator">Creator</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
      <button onClick={handleGoogleSignIn} className="mt-3 w-full border p-2 rounded">
        Continue with Google
      </button>
    </div>
  );
}