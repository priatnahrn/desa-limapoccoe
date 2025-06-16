// File: src/app/admin/penduduk/[pendudukId]/edit/page.jsx
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import { useParams, useRouter } from 'next/navigation';

export default function EditPendudukPage() {
  const { pendudukId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk/${pendudukId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setFormData(res.penduduk);
        setLoading(false);
      });
  }, [pendudukId]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk/${pendudukId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert(result.message || 'Data berhasil diperbarui.');
      router.push(`/admin/penduduk/${pendudukId}`);
    } catch (err) {
      console.error('❌ Gagal update:', err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Yakin ingin menghapus data ini?');
    if (!confirmDelete) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk/${pendudukId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const result = await res.json();
      alert(result.message || 'Data berhasil dihapus.');
      router.push('/admin/penduduk');
    } catch (err) {
      console.error('❌ Gagal hapus:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">✏️ Edit Data Penduduk</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded"
        >
          ← Kembali
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-2xl">
          {['nik', 'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'agama', 'status_perkawinan', 'pekerjaan', 'dusun', 'alamat', 'status_kependudukan', 'jenis_kelamin'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              💾 Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              🗑️ Hapus Data
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
