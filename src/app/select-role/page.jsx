"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function SelectRolePage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = async (role) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.patch("/auth/select-role", { role });
      loginUser({ token: localStorage.getItem("access-token"), user: res.data });
      toast.success(`Welcome! You're registered as a ${role}.`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set role");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-2">One more step</h1>
      <p className="text-slate-500 mb-6">How do you want to use FundRise?</p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleSelect("Supporter")}
          disabled={submitting}
          className="border p-4 rounded-lg hover:border-slate-900 text-left"
        >
          <p className="font-semibold">Supporter</p>
          <p className="text-slate-500 text-sm">Discover and fund campaigns · Starts with 50 credits</p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("Creator")}
          disabled={submitting}
          className="border p-4 rounded-lg hover:border-slate-900 text-left"
        >
          <p className="font-semibold">Creator</p>
          <p className="text-slate-500 text-sm">Launch and manage campaigns · Starts with 20 credits</p>
        </button>
      </div>
    </div>
  );
}