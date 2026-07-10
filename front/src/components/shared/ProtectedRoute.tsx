import { Navigate } from "react-router";
import { useAuthStore } from "../../stores/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
}
