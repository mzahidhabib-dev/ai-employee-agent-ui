import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Emails from './pages/Emails';
import Contacts from './pages/Contacts';
import Reports from './pages/Reports';
import Evaluations from './pages/Evaluations';
import Billing from './pages/Billing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="emails" element={<Emails />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="evaluations" element={<Evaluations />} />
        <Route path="billing" element={<Billing />} />
      </Route>

    </Routes>
  );
}
