'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImportPendudukPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Silakan pilih file terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengimpor data');
      }

      setMessage(data.message || 'Berhasil mengimpor data');
      setTimeout(() => {
        router.push('/admin/penduduk');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengimpor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">📥 Import Data Penduduk</h1>
          <Link href="/admin/penduduk" className="text-blue-600 hover:underline text-sm">
            ← Kembali
          </Link>
        </div>

        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih File Excel (.xlsx)</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Mengupload...' : 'Import Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
