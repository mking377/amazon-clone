// admin/src/components/Header.tsx
"use client";
import { useUser } from "../context/userContext";

export default function Header() {
  const { logout, user } = useUser();

  return (
    <header className="w-full bg-gray-100 p-4 flex justify-between items-center shadow">
      <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
