import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Compass,
  History,
  User,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/dashboard/classes',
      label: 'Kelas',
      icon: GraduationCap,
    },
    {
      to: '/dashboard/my-quizzes',
      label: isTeacher ? 'Kuis Saya' : 'Kuis Terdaftar',
      icon: BookOpen,
    },
    {
      to: '/dashboard/quizzes',
      label: 'Jelajahi Kuis',
      icon: Compass,
    },
    {
      to: '/dashboard/history',
      label: 'Riwayat Kuis',
      icon: History,
    },
    {
      to: '/dashboard/profile',
      label: 'Profil Akun',
      icon: User,
    },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between p-4 select-none">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-purple-200 shrink-0">
            T
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-base text-slate-900 tracking-tight block leading-tight">
              TEKA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
              Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-purple-600 text-white border border-purple-600 shadow-purple-200'
                        : 'bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-purple-700 border border-slate-200 hover:border-purple-300'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area: User Info & Logout Button */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        {/* Compact User Info */}
        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {getInitials(user?.nama)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.nama || 'Pengguna'}</p>
            <p className="text-[10px] font-bold text-purple-700 capitalize">
              {user?.role === 'teacher' ? 'Tenaga Pengajar' : 'Pelajar'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-sm transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
