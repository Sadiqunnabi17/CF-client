"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.needsRoleSelection && pathname !== "/select-role") {
      router.push("/select-role");
    }
  }, [loading, user, pathname]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) return null;
  if (user.needsRoleSelection && pathname !== "/select-role") return null;

  return children;
}