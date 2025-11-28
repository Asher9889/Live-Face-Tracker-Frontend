import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LiveMonitoring from '@/pages/LiveMonitoring';
import Attendance from '@/pages/Attendance';
import Visitors from '@/pages/Visitors';
import Employees from '@/pages/Employees';
import Cameras from '@/pages/Cameras';
import Alerts from '@/pages/Alerts';
import Timeline from '@/pages/Timeline';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="live" element={<LiveMonitoring />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="employees" element={<Employees />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="timeline" element={<Timeline />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
