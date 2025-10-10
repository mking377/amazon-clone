// admin/src/pages/index.tsx
"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <ProtectedRoute roles={["admin", "superadmin"]}>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <h1 className="text-3xl font-bold mt-4">Dashboard</h1>
          <p className="mt-2">Welcome to the admin panel!</p>
        </main>
      </div>
  صص٣  </ProtectedRoute>
 ث );
}


import React from "react";
export default function Admin() {
  return <h1>Hello from Admin Panel (React + TS)</h1>;
}
