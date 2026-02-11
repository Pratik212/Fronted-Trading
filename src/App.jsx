import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Parties from './pages/Parties';
import Challans from './pages/Challans';
import SearchByChallan from './pages/SearchByChallan';
import SearchByParty from './pages/SearchByParty';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import Salaries from './pages/Salaries';
import OfficeExpenses from './pages/OfficeExpenses';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('mk_token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/parties" replace />} />
        <Route path="parties" element={<Parties />} />
        <Route path="challans" element={<Challans />} />
        <Route path="search-by-challan" element={<SearchByChallan />} />
        <Route path="search-by-party" element={<SearchByParty />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="employees" element={<Employees />} />
        <Route path="salaries" element={<Salaries />} />
        <Route path="office-expenses" element={<OfficeExpenses />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
