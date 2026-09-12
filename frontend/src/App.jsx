import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { TrackProblemPage } from './pages/TrackProblemPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gov-bg text-slate-900 font-sans selection:bg-gov-green selection:text-white">
          {/* Government Navbar */}
          <Navbar />

          {/* Main Application Routes */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/report" element={<ReportProblemPage />} />
              <Route path="/track" element={<TrackProblemPage />} />
              <Route path="/universities" element={<UniversitiesPage />} />

              {/* Protected University Portal */}
              <Route
                path="/university/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['university', 'admin']}>
                    <UniversityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Public Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Dedicated Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Strictly Protected Government Admin Console */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Floating Feedback Toasts */}
          <ToastContainer />

          {/* Government Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
