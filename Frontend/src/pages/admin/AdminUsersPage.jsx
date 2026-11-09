import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { adminAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'student',
    status_aktif: true,
  });

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (searchQuery) params.search = searchQuery;

      const response = await adminAPI.getAllUsers(params);
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      nama: '',
      email: '',
      password: '',
      role: 'student',
      status_aktif: true,
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      nama: user.nama,
      email: user.email,
      password: '', // Password tidak ditampilkan saat edit
      role: user.role,
      status_aktif: user.status_aktif,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user "${userName}"?`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        toast.success('User berhasil dihapus');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Gagal menghapus user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (modalMode === 'add' && !formData.password) {
      toast.error('Password harus diisi untuk user baru');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        response = await adminAPI.createUser(formData);
      } else {
        // Saat edit, jangan kirim password jika kosong
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        response = await adminAPI.updateUser(selectedUser.id_user, updateData);
      }

      if (response.success) {
        toast.success(modalMode === 'add' ? 'User berhasil ditambahkan' : 'User berhasil diupdate');
        setShowModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Gagal menyimpan user');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await adminAPI.updateUser(userId, { status_aktif: !currentStatus });
      if (response.success) {
        toast.success('Status user berhasil diubah');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Gagal mengubah status user');
    }
  };

  const filteredUsers = users;

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      teacher: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      student: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    };
    return styles[role] || styles.student;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kelola Pengguna</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola semua pengguna sistem (Admin, Teacher, Student)
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={handleAddUser}
          className="w-full sm:w-auto"
        >
          Tambah Pengguna
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter((u) => u.role === 'teacher').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teachers</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter((u) => u.role === 'student').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter((u) => u.status_aktif).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Cari
          </button>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Kuis Diikuti
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id_user}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.nama}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status_aktif ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {user.quiz_count}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id_user, user.status_aktif)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status_aktif
                            ? 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400'
                        }`}
                        title={user.status_aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {user.status_aktif ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id_user, user.nama)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg bg-purple-600 text-white font-medium">
              1
            </button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              2
            </button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {modalMode === 'add' ? 'Tambah User' : 'Edit User'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label={modalMode === 'add' ? 'Password' : 'Password (kosongkan jika tidak diubah)'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={modalMode === 'add'}
                placeholder={modalMode === 'add' ? 'Minimal 8 karakter' : 'Biarkan kosong jika tidak ingin mengubah'}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status_aktif"
                  checked={formData.status_aktif}
                  onChange={(e) => setFormData({ ...formData, status_aktif: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status_aktif" className="text-sm text-gray-700 dark:text-gray-300">
                  Status Aktif
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" variant="primary" icon={Save} className="flex-1">
                  {modalMode === 'add' ? 'Tambah' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
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
