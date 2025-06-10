'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';

export default function AjuanDetailPage() {
  const { suratId, ajuanId } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchDetailAjuan = async () => {
    if (!token || !suratId || !ajuanId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/admin/${suratId}/${ajuanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();
      setAjuan(data.ajuan_surat || null);
    } catch (err) {
      console.error('❌ Gagal ambil detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailAjuan();
  }, [suratId, ajuanId, token]);

  const handleIsiNomorSurat = async () => {
    const nomorManual = prompt("Masukkan nomor urut surat (contoh: 001):");
    if (!nomorManual) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/admin/${suratId}/${ajuanId}/isi-nomor`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomor_surat: nomorManual }),
      });

      const data = await res.json();

      if (!res.ok || !data.nomor_surat) {
        alert(data.message || '❌ Gagal mengisi nomor surat.');
        return;
      }

      alert(`✅ Nomor berhasil diisi: ${data.nomor_surat}`);
      fetchDetailAjuan();
    } catch (err) {
      console.error('❌ Gagal isi nomor:', err);
      alert('Terjadi kesalahan saat mengisi nomor surat.');
    }
  };

  const handleKonfirmasiSurat = async () => {
    if (!confirm('Yakin ingin mengkonfirmasi surat ini?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/admin/${suratId}/${ajuanId}/konfirmasi`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Surat berhasil dikonfirmasi!');
        router.push(`/admin/surat/${suratId}`);
      } else {
        alert(data.message || '❌ Gagal konfirmasi surat.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengkonfirmasi surat.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Memuat detail pengajuan...</p>
      </AdminLayout>
    );
  }

  if (!ajuan) {
    return (
      <AdminLayout>
        <p>Data pengajuan tidak ditemukan.</p>
      </AdminLayout>
    );
  }

  let parsedData = {};
  try {
    parsedData = JSON.parse(ajuan.data_surat);
  } catch {
    parsedData = {};
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Detail Pengajuan Surat</h1>
      <button
        onClick={() => router.push(`/admin/surat/${suratId}`)}
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ⬅ Kembali ke Daftar Ajuan
      </button>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p><strong>Nama Pengaju:</strong> {ajuan.user?.name || '-'}</p>
        <p><strong>Status:</strong> <span className="capitalize">{ajuan.status}</span></p>
        <p><strong>Nomor Surat:</strong> {ajuan.nomor_surat || 'Belum diisi'}</p>
        <p><strong>Tanggal Pengajuan:</strong> {new Date(ajuan.created_at).toLocaleDateString('id-ID')}</p>

        <div>
          <strong>Data Surat:</strong>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {Object.entries(parsedData).map(([key, value]) => (
              <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</li>
            ))}
          </ul>
        </div>

        {ajuan.status !== 'confirmed' && (
          <>
            {!ajuan.nomor_surat && (
              <button
                onClick={handleIsiNomorSurat}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ✍ Isi Nomor Surat
              </button>
            )}

            {ajuan.nomor_surat && (
              <>
                <button
                  onClick={() => setPreviewVisible(!previewVisible)}
                  className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  🔍 {previewVisible ? 'Sembunyikan Preview' : 'Preview Surat'}
                </button>

                {previewVisible && (
                  <div className="my-4">
                    <iframe
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api/v1', '')}/preview-surat/${suratId}/${ajuanId}?token=${token}`}
                      width="100%"
                      height="500"
                      className="border rounded"
                    />
                  </div>
                )}

                <button
                  onClick={handleKonfirmasiSurat}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  ✅ Konfirmasi Surat
                </button>
              </>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
