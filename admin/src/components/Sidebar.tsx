// admin/src/components/Sidebar.tsx
"use client";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
    { name: "Comments", href: "/admin/comments" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:bg-gray-700 px-3 py-2 rounded">
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
