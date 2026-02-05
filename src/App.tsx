import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LiveMonitoring from '@/pages/LiveMonitoring';
import Alerts from '@/pages/Alerts';
import Timeline from '@/pages/Timeline';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import EmployeeHistory from '@/pages/Attendance/EmployeeHistory';
import NotFound from '@/pages/NotFound';
import { useAppSelector } from './store/hooks';
import { AppBootUpLoader } from './components/common';
import { useEffect, useRef } from 'react';
import appBootstrap from './bootstrap/appBootstrap';
import authBootstrap from './bootstrap/authBootstrap';
import { lazy, Suspense } from 'react';

const Employees = lazy(() => import('./pages/Employees/index'));
const Cameras = lazy(() => import('./pages/Cameras/index'));
const Attendance = lazy(() => import('./pages/Attendance/index'));
const Visitors = lazy(() => import ("./pages/Visitors/index"))

const ProtectedRoute = () => {
  const authStatus = useAppSelector((s) => s.auth.status);

  if (authStatus === "checking") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <AppBootUpLoader />
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {

  const authCheckedRef = useRef(false);
  const appBootstrappedRef = useRef(false);

  const authStatus = useAppSelector((s) => s.auth.status)
  // const bootstrapStatus = useAppSelector((s) => s.bootstrap.status);


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
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center">
            <AppBootUpLoader />
          </div>
        }
      >
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              authStatus === "authenticated" ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="live" element={<LiveMonitoring />} />
              <Route path="attendance" element={<Attendance />} />
              <Route
                path="attendance/employee/:id"
                element={<EmployeeHistory />}
              />
              <Route path="visitors" element={<Visitors />} />
              <Route path="employees" element={<Employees />} />
              <Route path="cameras" element={<Cameras />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="timeline" element={<Timeline />} />
              {/* 404 ONLY for authenticated users */}
              <Route path="*" element={<NotFound />} />

            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
