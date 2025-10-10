// admin/src/components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // صلاحيات مسموح لها
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (roles && !roles.includes(user.role))) {
        router.push("/login"); // لو مش مصرح له، يرجع لصفحة الدخول
      }
    }
  }, [user, loading, roles, router]);

  if (loading || !user) return <p>Loading...</p>;

  return <>{children}</>;
}
