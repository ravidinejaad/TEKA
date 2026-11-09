import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import { getInitials } from '../../utils/helpers';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  CheckCircle,
  KeyRound,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    nama: user?.nama || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.nama.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setSavingProfile(true);
    try {
      await userAPI.updateProfile({ nama: profileForm.nama });
      updateUser({ nama: profileForm.nama });
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui profil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error('Kata sandi saat ini wajib diisi');
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error('Kata sandi baru minimal 6 karakter');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setSavingPassword(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Kata sandi berhasil diubah!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah kata sandi');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Akun & Profil
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola informasi identitas, preferensi keamanan, dan data akun Anda.
        </p>
      </div>

      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-purple-200 shrink-0">
          {getInitials(user?.nama)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user?.nama || 'Pengguna'}</h2>
            <Badge variant="primary" size="sm" dot>
              {user?.role === 'teacher' ? 'Tenaga Pengajar' : 'Pelajar'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-400 pt-1">
            Status Akun: <span className="text-emerald-600 font-semibold">Aktif & Terverifikasi</span>
          </p>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Informasi Pribadi</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={profileForm.nama}
              onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
              icon={User}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Alamat email digunakan untuk login dan tidak dapat diubah secara langsung.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={savingProfile}
                icon={Save}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-600" />
            <span>Keamanan & Kata Sandi</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Kata Sandi Saat Ini"
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              icon={Lock}
            />

            <Input
              label="Kata Sandi Baru"
              type="password"
              placeholder="Minimal 6 karakter"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              icon={Lock}
            />

            <Input
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              icon={Lock}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="outline"
                size="md"
                className="w-full"
                isLoading={savingPassword}
                icon={Shield}
              >
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

