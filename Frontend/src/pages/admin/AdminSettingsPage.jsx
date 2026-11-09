import React, { useState } from 'react';
import {
  Settings,
  Save,
  Database,
  Shield,
  Bell,
  Mail,
  Globe,
  Server,
  CheckCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'TEKA - Quiz Learning System',
    siteDescription: 'Platform pembelajaran kuis interaktif',
    adminEmail: 'admin@teka.test',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    maxLoginAttempts: 5,
    sessionTimeout: 7200,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleSave = () => {
    // Simulate save
    toast.success('Pengaturan berhasil disimpan');
  };

  const tabs = [
    { id: 'general', label: 'Umum', icon: Settings },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Server },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pengaturan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Konfigurasi sistem dan preferensi admin
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Pengaturan Umum
              </h2>
            </div>

            <Input
              label="Nama Situs"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="TEKA - Quiz Learning System"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi Situs
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <Input
              label="Email Admin"
              type="email"
              icon={Mail}
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            />

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="checkbox"
                id="allowRegistration"
                checked={settings.allowRegistration}
                onChange={(e) =>
                  setSettings({ ...settings, allowRegistration: e.target.checked })
                }
                className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="allowRegistration"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Izinkan Registrasi Publik
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  User bisa mendaftar tanpa undangan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="w-4 h-4 rounded text-orange-600 border-gray-300 focus:ring-orange-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="maintenanceMode"
                  className="text-sm font-medium text-orange-900 dark:text-orange-100 cursor-pointer"
                >
                  Mode Maintenance
                </label>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Hanya admin yang bisa akses saat maintenance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Pengaturan Keamanan
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })
                }
                min="3"
                max="10"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Jumlah maksimal percobaan login sebelum akun diblokir
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (detik)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                }
                min="1800"
                max="86400"
                step="300"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Durasi session aktif (default: 7200 = 2 jam)
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="checkbox"
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  setSettings({ ...settings, requireEmailVerification: e.target.checked })
                }
                className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="requireEmailVerification"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Require Email Verification
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  User harus verifikasi email sebelum bisa login
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                    Password Policy
                  </h3>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                    <li>• Minimal 8 karakter</li>
                    <li>• Kombinasi huruf dan angka direkomendasikan</li>
                    <li>• Password di-hash dengan bcrypt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Pengaturan Notifikasi
              </h2>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="emailNotifications"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Kirim notifikasi via email untuk event penting
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, pushNotifications: e.target.checked })
                }
                className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="pushNotifications"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Push Notifications
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Push notification ke browser (memerlukan permission)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Informasi Sistem
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Versi Backend</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">v1.0.0</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Versi Frontend</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">v1.0.0</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Database</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">MySQL 8.0</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Node.js</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">v18.x</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                    System Status: Healthy
                  </h3>
                  <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                    Semua layanan berjalan normal
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
          <Button variant="outline">Reset</Button>
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
