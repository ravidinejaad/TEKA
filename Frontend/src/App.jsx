import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { useAuth } from './context/AuthContext';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import QuizPlayPage from './pages/public/QuizPlayPage';
import QuizResultPage from './pages/public/QuizResultPage';

// Student Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ClassesPage from './pages/dashboard/ClassesPage';
import MyQuizzesPage from './pages/dashboard/MyQuizzesPage';
import HistoryPage from './pages/dashboard/HistoryPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Admin Pages (placeholder - will be created)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

// Teacher Pages (placeholder - will be created)
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClassesPage from './pages/teacher/TeacherClassesPage';
import TeacherQuizzesPage from './pages/teacher/TeacherQuizzesPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on actual role
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <ToastContainer />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Quiz Play & Result (accessible after starting quiz) */}
            <Route 
              path="/quiz/play/:attemptId" 
              element={
                <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                  <QuizPlayPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/result/:attemptId" 
              element={
                <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                  <QuizResultPage />
                </ProtectedRoute>
              } 
            />

            {/* Student Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="quizzes" element={<MyQuizzesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>

            {/* Teacher Dashboard Routes */}
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClassesPage />} />
              <Route path="quizzes" element={<TeacherQuizzesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

