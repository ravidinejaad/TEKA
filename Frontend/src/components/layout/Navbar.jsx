import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../utils/api';
import { getInitials } from '../../utils/helpers';
import Button from '../ui/Button';
import {
  Sparkles,
  Bell,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI
        .getUnreadCount()
        .then((res) => {
          if (res?.data?.unread_count !== undefined) {
            setUnreadCount(res.data.unread_count);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isQuizPlayPage = location.pathname.startsWith('/quiz/play/');

  // If in quiz play mode, show minimal fixed navbar
  if (isQuizPlayPage) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm h-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-purple-700">
              <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-200">
                T
              </span>
              <span>TEKA</span>
            </Link>
            <div className="text-xs font-bold text-purple-800 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Mode Ujian Berlangsung</span>
            </div>
          </div>
        </header>
        {/* Fixed Navbar Spacer */}
        <div className="h-16 shrink-0" aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1">
              TEKA
              <span className="text-purple-600 text-xs font-black px-1.5 py-0.5 rounded-md bg-purple-50 uppercase tracking-widest border border-purple-100">
                Quiz
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                location.pathname === '/'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                  : 'bg-slate-100 text-slate-800 hover:text-purple-700 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/quizzes"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                location.pathname.startsWith('/quizzes')
                  ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                  : 'bg-slate-100 text-slate-800 hover:text-purple-700 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
              }`}
            >
              Jelajahi Kuis
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard/classes"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                  location.pathname.startsWith('/dashboard/classes')
                    ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                    : 'bg-slate-100 text-slate-800 hover:text-purple-700 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
                }`}
              >
                Kelas
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification icon */}
                <button
                  type="button"
                  className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 transition-colors"
                  title="Notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-300 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all focus:outline-none shadow-sm"
                  >
                    <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                      {user?.nama || 'Pengguna'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {getInitials(user?.nama)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-quiziz-lg border border-slate-200 py-2 animate-scale-in z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.nama}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                          {user?.role || 'student'}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-purple-600" />
                        Profil Saya
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button variant="white" size="sm" onClick={() => navigate('/login')}>
                  Masuk
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Daftar Gratis
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:text-purple-700 hover:bg-purple-50 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-slide-up">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
            >
              Beranda
            </Link>
            <Link
              to="/quizzes"
              className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
            >
              Jelajahi Kuis
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/classes"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
                >
                  Kelas Saya
                </Link>
                <Link
                  to="/dashboard/history"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
                >
                  Riwayat Kuis
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700"
                >
                  Profil Akun
                </Link>
                <div className="pt-2 border-t border-slate-100">
                  <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                    Keluar
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Button variant="white" size="md" className="w-full" onClick={() => navigate('/login')}>
                  Masuk
                </Button>
                <Button variant="primary" size="md" className="w-full" onClick={() => navigate('/register')}>
                  Daftar Gratis
                </Button>
              </div>
            )}
          </div>
        )}
      </header>
      {/* Fixed Navbar Spacer */}
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}
