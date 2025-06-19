'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import KepalaDesaLayout from '@/app/components/KepalaDesaLayout';

export default function DetailAduanPage() {
  const { aduanId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [aduan, setAduan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (aduanId) {
      fetchDetail();
    }
  }, [aduanId]);

  const fetchDetail = async () => {
    const token = localStorage.getItem('kepala_desa_token');
    if (!token) {
      alert('Sesi Anda habis, silakan login ulang.');
      router.push('/kepala-desa/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/admin/detail/${aduanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const result = await res.json();
      console.log('📦 Data detail:', result);

      if (!res.ok) {
        throw new Error(result.message || 'Gagal mengambil data dari server');
      }

      setAduan(result.aduan); // perhatikan ini harus disesuaikan dgn struktur JSON
    } catch (err) {
      console.error('❌ Gagal mengambil detail aduan:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KepalaDesaLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">📝 Detail Aduan</h1>
        <button
          onClick={() => router.back()}
          className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          ← Kembali
        </button>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : !aduan ? (
        <p>Data aduan tidak ditemukan.</p>
      ) : (
        <div className="bg-white shadow rounded p-4 space-y-3 text-sm text-gray-800">
          <p><strong>Judul:</strong> {aduan.title}</p>
          <p><strong>Pengadu:</strong> {aduan.user?.name || '-'}</p>
          <p><strong>Kategori:</strong> {aduan.category}</p>
          <p><strong>Lokasi:</strong> {aduan.location || '-'}</p>
          <p><strong>Isi:</strong> {aduan.content}</p>
          <p><strong>Status:</strong> <span className="capitalize">{aduan.status}</span></p>
          <p><strong>Tanggal:</strong> {aduan.created_at ? new Date(aduan.created_at).toLocaleString('id-ID') : '-'}</p>

          {aduan.evidence && (
            <div>
              <strong>Lampiran Gambar:</strong>
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api/v1', '')}/storage/${aduan.evidence}`}
                alt="Lampiran"
                className="mt-2 max-w-xs rounded border"
              />
            </div>
          )}
        </div>
      )}
    </KepalaDesaLayout>
  );
}
