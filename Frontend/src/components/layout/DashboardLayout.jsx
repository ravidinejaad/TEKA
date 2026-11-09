import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Loader from '../ui/Loader';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return <Loader fullScreen text="Memuat sesi akun..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Desktop Sidebar (Top-to-Bottom, No Navbar) */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-white z-10 shadow-2xl flex flex-col h-full animate-slide-up">
            <div className="p-3.5 flex items-center justify-between border-b border-slate-200">
              <span className="font-extrabold text-slate-800 text-sm">Menu Dashboard</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area (Offset with lg:pl-64 for fixed sidebar, No Navbar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Mobile Header Bar (Only visible on mobile screens) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              T
            </div>
            <span className="font-extrabold text-slate-900 text-base">TEKA Dashboard</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
