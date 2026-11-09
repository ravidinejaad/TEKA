import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { classAPI } from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import {
  GraduationCap,
  Plus,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export default function ClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role === 'teacher';

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Form for create class (teacher only)
  const [newClass, setNewClass] = useState({
    nama_kelas: '',
    deskripsi: '',
    id_kategori: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  const { data: classesData, loading, refetch } = useApi(
    () => classAPI.getAll({ page: 1, limit: 20 }),
    []
  );

  const classes = classesData?.classes || classesData || [];

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast.error('Masukkan kode kelas');
      return;
    }

    setSubmitting(true);
    try {
      await classAPI.joinClass(classCode.trim().toUpperCase());
      toast.success('Berhasil bergabung ke kelas!');
      setJoinModalOpen(false);
      setClassCode('');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Gagal bergabung ke kelas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.nama_kelas.trim()) {
      toast.error('Nama kelas wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      await classAPI.create(newClass);
      toast.success('Kelas berhasil dibuat!');
      setCreateModalOpen(false);
      setNewClass({ nama_kelas: '', deskripsi: '', id_kategori: 1 });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Gagal membuat kelas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Kode kelas disalin ke clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isTeacher ? 'Manajemen Kelas' : 'Kelas Belajar Saya'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isTeacher
              ? 'Kelola ruang kelas, buat kuis, dan pantau hasil belajar siswa.'
              : 'Daftar seluruh ruang kelas tempat Anda terdaftar dan kuis yang ditugaskan.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setJoinModalOpen(true)}
            icon={Plus}
          >
            Gabung Kelas
          </Button>

          {isTeacher && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCreateModalOpen(true)}
              icon={Plus}
            >
              Buat Kelas Baru
            </Button>
          )}
        </div>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" count={6} className="h-48 rounded-3xl" />
        </div>
      ) : classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card
              key={cls.id_kelas}
              hover
              onClick={() => navigate(`/dashboard/my-quizzes?classId=${cls.id_kelas}`)}
              className="p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                      {cls.kode_kelas}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(cls.kode_kelas, e)}
                      className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                      title="Salin Kode Kelas"
                    >
                      {copiedCode === cls.kode_kelas ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <Badge variant="secondary" size="sm">
                    {cls.kategori || cls.nama_kategori || 'Umum'}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors mb-2">
                  {cls.nama_kelas}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {cls.deskripsi || 'Tidak ada deskripsi untuk kelas ini.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>{cls.total_members || cls.jumlah_anggota || '1'} Siswa</span>
                </div>

                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Buka Kuis <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Kelas</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Anda belum tergabung di kelas belajar manapun. Masukkan kode kelas dari gurumu sekarang.
          </p>
          <Button variant="primary" size="md" onClick={() => setJoinModalOpen(true)}>
            Gabung Kelas Sekarang
          </Button>
        </div>
      )}

      {/* Join Class Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Gabung Kelas Belajar"
        description="Masukkan kode kelas dari guru untuk mengakses materi dan kuis."
      >
        <form onSubmit={handleJoinClass} className="space-y-4 pt-2">
          <Input
            label="Kode Kelas"
            placeholder="Contoh: KLS-MAT10"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setJoinModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              Gabung Kelas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Class Modal (Teacher) */}
      {isTeacher && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Buat Kelas Baru"
          description="Siswa dapat bergabung dengan kode kelas yang akan dibuat secara otomatis."
        >
          <form onSubmit={handleCreateClass} className="space-y-4 pt-2">
            <Input
              label="Nama Kelas"
              placeholder="Contoh: Fisika Kuantum Kelas XII-A"
              value={newClass.nama_kelas}
              onChange={(e) => setNewClass({ ...newClass, nama_kelas: e.target.value })}
              autoFocus
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan tujuan atau materi yang akan dipelajari di kelas ini..."
                value={newClass.deskripsi}
                onChange={(e) => setNewClass({ ...newClass, deskripsi: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="md" onClick={() => setCreateModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={submitting}>
                Simpan & Buat Kelas
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

