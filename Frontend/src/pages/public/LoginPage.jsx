import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      errs.password = 'Password wajib diisi';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      toast.success('Login berhasil! Selamat datang kembali.');
      
      // Role-based redirect
      if (userData.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userData.role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        // student role
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">TEKA</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-500">
            Daftar gratis sekarang
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-quiziz-card rounded-2xl border border-slate-200/80 sm:px-10 animate-slide-up">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
              autoFocus
            />

            <div className="relative">
              <Input
                label="Kata Sandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
                />
                <span className="text-slate-600 text-xs sm:text-sm">Ingat saya</span>
              </label>

              <span className="text-xs text-purple-600 hover:underline cursor-pointer">
                Lupa sandi?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold shadow-md shadow-purple-200"
              isLoading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Masuk
            </Button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              💡 Belum punya akun kelas? Silakan registrasi terlebih dahulu sebagai siswa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

