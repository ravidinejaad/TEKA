import React, { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import QuizCard from '../../components/quiz/QuizCard';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useApi } from '../../hooks/useApi';
import { categoryAPI, classAPI } from '../../utils/api';
import { Search, Sparkles, Filter, BookOpen, Layers } from 'lucide-react';

export default function QuizzesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch categories
  const { data: categoriesData, loading: loadingCategories } = useApi(
    () => categoryAPI.getAll(),
    []
  );

  // Fetch classes to find published quizzes
  const { data: classesData, loading: loadingClasses } = useApi(
    () => classAPI.getAll({ page: 1, limit: 10 }),
    []
  );

  const categories = categoriesData?.categories || categoriesData || [];
  const classes = classesData?.classes || classesData || [];

  // Flatten or generate mock/real quizzes based on available data
  // The system allows finding quizzes from user's classes or publicly available quizzes
  const quizzesList = useMemo(() => {
    // If backend returns public quizzes or class quizzes, compile them
    const list = [];
    if (classes && classes.length > 0) {
      classes.forEach((c) => {
        if (c.quizzes && Array.isArray(c.quizzes)) {
          c.quizzes.forEach((q) => {
            list.push({ ...q, nama_kelas: c.nama_kelas });
          });
        }
      });
    }

    // Default sample quizzes if database is fresh, providing instant exploration
    if (list.length === 0) {
      return [
        {
          id_kuis: 1,
          judul: 'Kuis Logika Matematika & Aljabar Dasar',
          deskripsi: 'Uji kemampuan logika, proposisi, dan penyelesaian aljabar tingkat menengah.',
          durasi_menit: 20,
          total_soal: 10,
          status: 'published',
          nama_kelas: 'Matematika X-A',
          id_kategori: 1,
        },
        {
          id_kuis: 2,
          judul: 'Pemrograman Web Modern dengan JavaScript',
          deskripsi: 'Evaluasi konsep ES6+, Asynchronous, DOM manipulation, dan functional programming.',
          durasi_menit: 30,
          total_soal: 15,
          status: 'published',
          nama_kelas: 'RPL XII',
          id_kategori: 2,
        },
        {
          id_kuis: 3,
          judul: 'Struktur Data & Algoritma Dasar',
          deskripsi: 'Pertanyaan seputar array, linked list, stack, queue, dan kompleksitas waktu Big-O.',
          durasi_menit: 25,
          total_soal: 12,
          status: 'published',
          nama_kelas: 'Informatika XI',
          id_kategori: 2,
        },
        {
          id_kuis: 4,
          judul: 'Bahasa Indonesia: Teks Argumentasi & Editorial',
          deskripsi: 'Menganalisis struktur teks argumentasi, opini redaksi, dan kaidah kebahasaan baku.',
          durasi_menit: 20,
          total_soal: 10,
          status: 'published',
          nama_kelas: 'Bahasa Indonesia XI',
          id_kategori: 3,
        },
      ];
    }

    return list;
  }, [classes]);

  // Filter & Search
  const filteredQuizzes = useMemo(() => {
    return quizzesList.filter((q) => {
      const matchSearch =
        q.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'all' ||
        String(q.id_kategori) === String(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [quizzesList, searchTerm, selectedCategory]);

  const isLoading = loadingCategories || loadingClasses;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Kuis Lengkap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Temukan Kuis Sesuai Minat & Kelasmu
          </h1>
          <p className="text-purple-100/90 text-sm sm:text-base max-w-2xl">
            Pilih dari beragam kategori kuis interaktif yang dirancang untuk mengasah pemahamanmu secara menyeluruh.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Controls: Search and Categories */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Box */}
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Cari judul atau topik kuis..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Total Indicator */}
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredQuizzes.length}</span> kuis
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-purple-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id_kategori}
                onClick={() => setSelectedCategory(String(cat.id_kategori))}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
                  String(selectedCategory) === String(cat.id_kategori)
                    ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-purple-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                {cat.nama_kategori}
              </button>
            ))}
          </div>
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton variant="rect" count={6} className="h-64 rounded-2xl" />
          </div>
        ) : filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id_kuis} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Kuis Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Tidak ada kuis yang cocok dengan kata kunci atau filter kategori yang dipilih.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

