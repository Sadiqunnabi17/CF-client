"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/imgbb";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Supporter",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    let photoURL = "";
    if (imageFile) {
      setUploading(true);
      try {
        photoURL = await uploadToImgBB(imageFile);
      } catch (err) {
        setError("Image upload failed, please try again");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      const res = await axiosInstance.post("/auth/register", { ...form, photoURL });
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg mb-16">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" required onChange={handleChange} className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="border p-2 rounded" />

        <label className="text-sm text-slate-600">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 rounded text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:text-xs hover:file:bg-indigo-700"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={handleChange}
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

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <select name="role" onChange={handleChange} className="border p-2 rounded">
          <option value="Supporter">Supporter</option>
          <option value="Creator">Creator</option>
        </select>
        <button
          type="submit"
          disabled={uploading}
          className="bg-indigo-600 text-white p-2 rounded disabled:opacity-50 hover:bg-indigo-700"
        >
          {uploading ? "Uploading image..." : "Register"}
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
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}