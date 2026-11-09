import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                T
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">TEKA Quiz</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Platform kuis interaktif anti-slop yang cepat, menyenangkan, dan berorientasi pada
              pembelajaran nyata untuk siswa & guru modern.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Dibangun dengan React + Vite + Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-purple-600 transition-colors">
                  Jelajahi Kuis
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-purple-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Tentang</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Teka Learning Platform</li>
              <li>Versi 1.0.0 Production Ready</li>
              <li className="pt-2 text-xs text-purple-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interaktif & Responsif</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} TEKA. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk pendidikan
            Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

