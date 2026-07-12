"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return router.push("/login");

    localStorage.setItem("access-token", token);
    // Fetch user profile using the token, then store + redirect
    axiosInstance.get("/auth/me").then((res) => {
      loginUser({ token, user: res.data });
      if (res.data.needsRoleSelection) {
        router.push("/select-role");
      } else {
        router.push("/dashboard");
      }
    });
  }, []);

  return <p className="text-center mt-10">Signing you in...</p>;
}