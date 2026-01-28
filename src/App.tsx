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
import EmployeeHistory from '@/pages/Attendance/EmployeeHistory';
import { useAppSelector } from './store/hooks';
import { AppBootUpLoader } from './components/common';
import { useEffect, useRef } from 'react';
import appBootstrap from './bootstrap/appBootstrap';
import authBootstrap from './bootstrap/authBootstrap';

function App() {

  const authCheckedRef = useRef(false);
  const appBootstrappedRef = useRef(false);

  const authStatus = useAppSelector((s) => s.auth.status)
  const bootstrapStatus = useAppSelector((s) => s.bootstrap.status);


  useEffect(() => {
    if (!authCheckedRef.current) {
      authBootstrap();
      authCheckedRef.current = true;
    }
  }, [])


  useEffect(() => {
    if (authStatus === "authenticated" && !appBootstrappedRef.current) {
      appBootstrap();
      appBootstrappedRef.current = true;
    }
  }, [authStatus])

  if (authStatus === "checking") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <AppBootUpLoader />
      </div>
    );
  }



  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public */}
        <Route path="/login" element={authStatus === "authenticated" ? (<Navigate to="/" replace />) : (<Login />)} />

        {/* 🔐 Protected */}
        {authStatus === "authenticated" && (
          <Route path="/" element={<MainLayout />}>
            {bootstrapStatus === "loading" ? (
              <Route
                index
                element={
                  <div className="w-full h-full flex items-center justify-center">
                    <AppBootUpLoader />
                  </div>
                }
              />
            ) : (
              <>
                <Route index element={<Dashboard />} />
                <Route path="live" element={<LiveMonitoring />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="attendance/employee/:id" element={<EmployeeHistory />}/>
                <Route path="visitors" element={<Visitors />} />
                <Route path="employees" element={<Employees />} />
                <Route path="cameras" element={<Cameras />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="timeline" element={<Timeline />} />
              </>
            )}
          </Route>
        )}

          {/* Catch-all */}
        <Route path="*" element={<Navigate to={authStatus === "authenticated" ? "/" : "/login"}replace />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
