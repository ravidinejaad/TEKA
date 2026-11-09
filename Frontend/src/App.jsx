import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ClassesPage from './pages/dashboard/ClassesPage';
import MyQuizzesPage from './pages/dashboard/MyQuizzesPage';
import HistoryPage from './pages/dashboard/HistoryPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Quiz Pages (inside dashboard layout)
import QuizzesPage from './pages/public/QuizzesPage';
import QuizDetailPage from './pages/public/QuizDetailPage';

// Quiz Play & Result (full-screen, no sidebar)
import QuizPlayPage from './pages/public/QuizPlayPage';
import QuizResultPage from './pages/public/QuizResultPage';

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

            {/* Quiz Play & Result — full-screen, auth protected via page-level check */}
            <Route path="/quiz/play/:attemptId" element={<QuizPlayPage />} />
            <Route path="/quiz/result/:attemptId" element={<QuizResultPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="my-quizzes" element={<MyQuizzesPage />} />
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="quizzes/:id" element={<QuizDetailPage />} />
              <Route path="history" element={<HistoryPage />} />
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
