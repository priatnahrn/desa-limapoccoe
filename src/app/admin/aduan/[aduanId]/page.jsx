'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';

export default function DetailAduanPage() {
  const { aduanId } = useParams();
  const router = useRouter();
  const [aduan, setAduan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [aduanId]);

  const fetchDetail = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/admin/detail/${aduanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();
      console.log(data)
      setAduan(data.aduan);
      setResponseText(data.aduan.response || '');
    } catch (err) {
      console.error('❌ Gagal mengambil detail aduan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessed = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token || !responseText) return;

    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/admin/processed/${aduanId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText }),
      });

      
      if (res.ok) {
        fetchDetail();
      } else {
        console.error('❌ Gagal update status');
      }
    } catch (err) {
      console.error('❌ Error saat update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/admin/approved/${aduanId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        fetchDetail();
      } else {
        console.error('❌ Gagal setujui aduan');
      }
    } catch (err) {
      console.error('❌ Error saat approve:', err);
    } finally {
      setUpdating(false);
    }
  };

  const renderAction = () => {
    if (aduan.status === 'waiting') {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Tanggapan Admin:</label>
          <textarea
            rows={4}
            className="w-full p-2 border rounded text-sm"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Tulis tanggapan anda terhadap aduan ini"
          ></textarea>
          <button
            onClick={handleProcessed}
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            disabled={updating}
          >
            TERIMA PENGADUAN
          </button>
        </div>
      );
    } else if (aduan.status === 'processed') {
      return (
        <button
          onClick={handleApprove}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          disabled={updating}
        >
          SELESAIKAN PENGADUAN
        </button>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
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
      ) : !aduan ? (
        <p>Data aduan tidak ditemukan.</p>
      ) : (
        <div className="bg-white shadow rounded p-4 space-y-3 text-sm text-gray-800">
          <p><strong>Judul:</strong> {aduan.title}</p>
          <p><strong>Pengadu:</strong> {aduan.user?.name || '-'}</p>
          <p><strong>Kategori:</strong> {aduan.category}</p>
          <p><strong>Lokasi:</strong> {aduan.location}</p>
          <p><strong>Isi:</strong> {aduan.content}</p>
          <p><strong>Status:</strong> <span className="capitalize">{aduan.status}</span></p>
          <p><strong>Tanggal:</strong> {new Date(aduan.created_at).toLocaleString('id-ID')}</p>

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

          {/* Tanggapan dari Admin jika sudah ada */}
            {aduan.response && (
            <div className="p-4 border rounded bg-gray-50">
                <p className="text-sm font-semibold mb-2">📌 Tanggapan Admin:</p>
                <p className="text-sm text-gray-800 whitespace-pre-line">{aduan.response}</p>

                <div className="mt-2 text-xs text-gray-500">
                <p><strong>Nama Admin Penanggap:</strong> {aduan.response_by_name}</p>
                <p><strong>Tanggal Tanggapan:</strong> {aduan.response_date ? new Date(aduan.response_date).toLocaleDateString('id-ID') : '-'}</p>
                </div>
            </div>
            )}

          {/* Tanggapan dan Tombol Aksi */}
          {renderAction()}
        </div>
      )}
    </AdminLayout>
  );
}
