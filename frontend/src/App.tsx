import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LoginPage } from './pages/LoginPage';
import { FacultyDashboardPage } from './pages/FacultyDashboardPage';
import { StudentRosterPage } from './pages/StudentRosterPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { FacultyAlertsPage } from './pages/FacultyAlertsPage';
import { ClassroomVisionPage } from './pages/ClassroomVisionPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Restoring Academic Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Core Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <FacultyDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentRosterPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <FacultyAlertsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vision"
              element={
                <ProtectedRoute>
                  <ClassroomVisionPage />
                </ProtectedRoute>
              }
            />

            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFoundPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
