import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Search,
  Plus,
  LogIn,
  X,
  RefreshCw,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { classAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ClassesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await classAPI.getAll();
      // Backend returns: { success, data: { classes: [], pagination: {} } }
      if (res?.success) {
        const classesData = res.data?.classes || res.data || [];
        setClasses(Array.isArray(classesData) ? classesData : []);
      } else {
        toast.error(res?.message || 'Gagal memuat data kelas');
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error(error?.message || 'Gagal memuat data kelas');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Kode kelas harus diisi');
      return;
    }
    try {
      const response = await classAPI.joinClass(joinCode.trim());
      if (response?.success) {
        toast.success('Berhasil bergabung ke kelas!');
        setShowJoinModal(false);
        setJoinCode('');
        fetchClasses();
      } else {
        toast.error(response?.message || 'Gagal bergabung ke kelas');
      }
    } catch (error) {
      console.error('Error joining class:', error);
      toast.error(error?.message || 'Gagal bergabung ke kelas');
    }
  };

  const filteredClasses = classes.filter((cls) =>
    cls.nama_kelas?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kelas Saya</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelas yang Anda ikuti · <span className="font-semibold text-slate-700">{classes.length} kelas</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchClasses}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowJoinModal(true)}
          >
            Gabung Kelas
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-600">Total Kelas</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{classes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-600">Status</p>
          </div>
          <p className="text-xl font-bold text-green-600">Aktif</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-600">Hasil Pencarian</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{filteredClasses.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id_kelas}
              className="bg-white rounded-xl border-2 border-purple-100 hover:border-purple-300 p-6 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100 flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-700" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
                {cls.nama_kelas}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {cls.deskripsi || 'Tidak ada deskripsi'}
              </p>

              {/* Class Code */}
              <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="text-xs text-slate-500 mb-1">Kode Kelas</p>
                <p className="font-mono font-bold text-lg text-purple-700">
                  {cls.kode_kelas}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {cls.created_at
                      ? new Date(cls.created_at).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {classes.length === 0 ? 'Belum ada kelas' : 'Kelas tidak ditemukan'}
          </h3>
          <p className="text-slate-500 mb-6">
            {classes.length === 0
              ? 'Bergabung ke kelas menggunakan kode kelas dari guru Anda'
              : 'Tidak ada kelas yang cocok dengan pencarian Anda'}
          </p>
          {classes.length === 0 && (
            <Button variant="primary" icon={Plus} onClick={() => setShowJoinModal(true)}>
              Gabung Kelas
            </Button>
          )}
        </div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Gabung Kelas</h2>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode('');
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <p className="text-sm text-slate-500">
                Masukkan kode kelas yang diberikan oleh guru Anda
              </p>
              <Input
                label="Kode Kelas"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Contoh: MTK10A"
                required
              />
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" icon={LogIn} className="flex-1" isLoading={joining}>
                  Gabung
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode('');
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
