import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Trophy,
  CheckCircle,
  HelpCircle,
  Users,
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax offsets (disabled on mobile via CSS)
  const heroOffset = scrollY * 0.4;
  const midOffset = scrollY * 0.25;

  return (
    <div className="landing-page min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section with Parallax */}
      <section className="hero-section relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white px-4 py-20">
        {/* Parallax Background Glowing Blobs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none"
          style={{ transform: `translateY(${heroOffset * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 pointer-events-none"
          style={{ transform: `translateY(${heroOffset * 0.5}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-500/20 rounded-full filter blur-[120px] pointer-events-none"
          style={{ transform: `translateY(${heroOffset * 0.2}px)` }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs sm:text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Platform Kuis Pembelajaran Interaktif Modern</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Belajar & Evaluasi Jadi Lebih{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
              Menyenangkan
            </span>
          </h1>

          <p className="text-base sm:text-xl text-purple-100/90 max-w-2xl mx-auto leading-relaxed">
            Rasakan sensasi kuis modern dengan analitik instan, antarmuka responsif tanpa beban AI-slop, dan terintegrasi penuh untuk siswa serta pendidik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="white"
              className="w-full sm:w-auto shadow-xl hover:scale-105 active:scale-95"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              icon={ArrowRight}
              iconPosition="right"
            >
              {isAuthenticated ? 'Buka Dashboard' : 'Mulai Belajar Sekarang'}
            </Button>
            <Button
              size="lg"
              variant="white-outline"
              className="w-full sm:w-auto hover:scale-105 active:scale-95"
              onClick={() => navigate('/login')}
            >
              Masuk
              Jelajahi Kuis Publik
            </Button>
          </div>

          {/* Quick Features List */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-purple-200/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Koreksi Otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Pembahasan Lengkap</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Akses Gratis Selamanya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Parallax */}
      <section className="py-16 bg-white border-b border-slate-200/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Pengguna Aktif', icon: Users },
              { number: '1000+', label: 'Kuis Terverifikasi', icon: HelpCircle },
              { number: '50K+', label: 'Pertanyaan Terjawab', icon: Zap },
              { number: '98%', label: 'Tingkat Kepuasan', icon: Trophy },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all duration-300 group"
                  style={{ transform: `translateY(${midOffset * 0.15}px)` }}
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose TEKA (Features) */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50/50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Keunggulan Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Memilih TEKA?
            </h2>
            <p className="text-slate-600 text-base">
              Dirancang dengan antarmuka yang bersih, intuitif, dan responsif untuk memaksimalkan fokus belajar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: 'Fokus & Terarah',
                desc: 'Kuis terstruktur rapi berdasarkan kategori dan kurikulum kelas yang jelas.',
                badge: 'Terorganisir',
              },
              {
                icon: Zap,
                title: 'Cepat & Interaktif',
                desc: 'Simulasi ujian realtime dengan pewaktu presisi dan auto-save jawaban instan.',
                badge: 'Real-time',
              },
              {
                icon: BarChart3,
                title: 'Analitik Detail',
                desc: 'Skor instan beserta pembahasan mendalam setiap butir soal selesai dikerjakan.',
                badge: 'Evaluasi',
              },
              {
                icon: Trophy,
                title: 'Peringkat & Riwayat',
                desc: 'Lihat peringkat kelas, pantau riwayat perkembangan nilai dan skor Anda.',
                badge: 'Kompetisi',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-quiziz hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                      {feature.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Siap Menguji Pengetahuan Anda?
          </h2>
          <p className="text-base sm:text-lg text-purple-100 max-w-xl mx-auto">
            Bergabunglah sekarang secara gratis dan mulai jelajahi ratusan kuis menarik dari berbagai mata pelajaran.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="white"
              className="shadow-2xl px-8"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            >
              {isAuthenticated ? 'Ke Dashboard Saya' : 'Daftar Sekarang - Gratis!'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

