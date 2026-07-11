"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard (placeholder)</h1>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Credits:</strong> {user?.credits}</p>
        <button onClick={logoutUser} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </PrivateRoute>
  );
}