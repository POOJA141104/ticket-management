import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role?.name)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}
