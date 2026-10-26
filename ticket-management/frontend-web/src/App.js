import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/transactions/Dashboard";
import RaiseComplaint from "./pages/transactions/RaiseComplaint";
import Complaints from "./pages/transactions/Complaints";
import { Departments, Programmes, Blocks, Rooms, Roles, Users } from "./pages/master/MasterScreens";
import Reports from "./pages/reports/Reports";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      {/* All authenticated */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />

      {/* User & SuperAdmin only */}
      <Route path="/raise" element={<ProtectedRoute roles={["SuperAdmin","User"]}><RaiseComplaint /></ProtectedRoute>} />

      {/* SuperAdmin only */}
      <Route path="/departments" element={<ProtectedRoute roles={["SuperAdmin"]}><Departments /></ProtectedRoute>} />
      <Route path="/programmes"  element={<ProtectedRoute roles={["SuperAdmin"]}><Programmes /></ProtectedRoute>} />
      <Route path="/blocks"      element={<ProtectedRoute roles={["SuperAdmin"]}><Blocks /></ProtectedRoute>} />
      <Route path="/rooms"       element={<ProtectedRoute roles={["SuperAdmin"]}><Rooms /></ProtectedRoute>} />
      <Route path="/roles"       element={<ProtectedRoute roles={["SuperAdmin"]}><Roles /></ProtectedRoute>} />
      <Route path="/users"       element={<ProtectedRoute roles={["SuperAdmin"]}><Users /></ProtectedRoute>} />
      <Route path="/reports"     element={<ProtectedRoute roles={["SuperAdmin"]}><Reports /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
