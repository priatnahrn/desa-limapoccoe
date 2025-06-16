// File: src/app/admin/penduduk/[pendudukId]/page.jsx (Detail Page)
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import { useParams, useRouter } from 'next/navigation';

export default function DetailPendudukPage() {
  const { pendudukId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
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
        setData(res.penduduk);
        setLoading(false);
      });
  }, [pendudukId]);

  const handleDelete = async () => {
    const confirm = window.confirm('Yakin ingin menghapus data ini?');
    if (!confirm) return;

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
      <h1 className="text-2xl font-bold mb-4">Detail Penduduk</h1>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          <p><strong>NIK:</strong> {data.nik}</p>
          <p><strong>Nama:</strong> {data.nama_lengkap}</p>
          <p><strong>Jenis Kelamin:</strong> {data.jenis_kelamin}</p>
          <p><strong>Tempat Lahir:</strong> {data.tempat_lahir}</p>
          <p><strong>Tanggal Lahir:</strong> {data.tanggal_lahir}</p>
          <p><strong>Agama:</strong> {data.agama}</p>
          <p><strong>Status Perkawinan:</strong> {data.status_perkawinan}</p>
          <p><strong>Pekerjaan:</strong> {data.pekerjaan}</p>
          <p><strong>Dusun:</strong> {data.dusun}</p>
          <p><strong>Alamat:</strong> {data.alamat}</p>
          <p><strong>Status Kependudukan:</strong> {data.status_kependudukan}</p>
          <p><strong>Dibuat pada:</strong> {new Date(data.created_at).toLocaleDateString('id-ID')}</p>
          <p><strong>Diperbarui pada:</strong> {new Date(data.updated_at).toLocaleDateString('id-ID')}</p>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => router.push(`/admin/penduduk/${pendudukId}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
