import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a fancy spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import Layout from './components/Layout';
import Assets from './pages/Assets';
import Transfers from './pages/Transfers';
import Branches from './pages/Branches';
import BranchAssets from './pages/BranchAssets';
import Users from './pages/Users';
import DevTeam from './pages/DevTeam';

// ... (previous imports)

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/branches/:branchId" element={<BranchAssets />} />
        <Route path="/users" element={<Users />} />
        <Route path="/dev-team" element={<DevTeam />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
