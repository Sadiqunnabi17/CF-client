"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
  const [imageFile, setImageFile] = useState(null);
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
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
          className="border p-2 rounded text-sm"
        />

        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="border p-2 rounded" />
        <select name="role" onChange={handleChange} className="border p-2 rounded">
          <option value="Supporter">Supporter</option>
          <option value="Creator">Creator</option>
        </select>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading image..." : "Register"}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} className="mt-3 w-full border p-2 rounded">
        Continue with Google
      </button>
    </div>
  );
}