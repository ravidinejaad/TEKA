import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength logic
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Kosong', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Lemah', color: 'bg-rose-500' };
      case 2:
        return { score: 50, text: 'Sedang', color: 'bg-amber-500' };
      case 3:
        return { score: 75, text: 'Bagus', color: 'bg-sky-500' };
      case 4:
        return { score: 100, text: 'Kuat', color: 'bg-emerald-500' };
      default:
        return { score: 0, text: 'Sangat Lemah', color: 'bg-slate-200' };
    }
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) {
      errs.nama = 'Nama lengkap wajib diisi';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      errs.password = 'Kata sandi wajib diisi';
    } else if (formData.password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData.nama, formData.email, formData.password);
      toast.success('Pendaftaran berhasil! Selamat datang di TEKA.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">TEKA</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Buat Akun Pelajar Gratis
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500">
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-quiziz-card rounded-2xl border border-slate-200/80 sm:px-10 animate-slide-up">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Andi Pratama"
              icon={User}
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              error={errors.nama}
              autoFocus
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="andi@email.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <div className="relative">
              <Input
                label="Kata Sandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Kekuatan Sandi:</span>
                  <span className="font-semibold text-slate-700">{strength.text}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}

            <Input
              label="Konfirmasi Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-semibold shadow-md shadow-purple-200"
                isLoading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Daftar Akun Baru
              </Button>
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-slate-400">
            Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi TEKA.
          </p>
        </div>
      </div>
    </div>
  );
}

