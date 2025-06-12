'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import KepalaDesaLayout from '@/app/components/KepalaDesaLayout';

export default function AjuanDetailPage() {
  const { suratId, ajuanId } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('kepala_desa_token') : null;

  const fetchDetailAjuan = async () => {
    if (!token || !suratId || !ajuanId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/kepala-desa/confirmed/${suratId}/${ajuanId}`, {
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

  const handleTandaTanganSurat = async () => {
  if (!token) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/kepala-desa/ajuan-surat/${suratId}/${ajuanId}/signed`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Surat berhasil ditandatangani!");
      fetchDetailAjuan(); // refresh data
    } else {
      alert(data.message || "Gagal menandatangani surat.");
    }
  } catch (err) {
    console.error("❌ Gagal menandatangani:", err);
    alert("Terjadi kesalahan saat menandatangani surat.");
  }
};


  if (loading) {
    return (
      <KepalaDesaLayout>
        <p>Memuat detail pengajuan...</p>
      </KepalaDesaLayout>
    );
  }

  if (!ajuan) {
    return (
      <KepalaDesaLayout>
        <p>Data pengajuan tidak ditemukan.</p>
      </KepalaDesaLayout>
    );
  }

  let parsedData = {};
  try {
    parsedData = JSON.parse(ajuan.data_surat);
  } catch {
    parsedData = {};
  }

  return (
    <KepalaDesaLayout>
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

       {ajuan.status === 'confirmed' && (
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

    {!ajuan.file && (
      <button
        onClick={handleTandaTanganSurat}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        🖋️ Tanda Tangani Surat
      </button>
    )}

    {ajuan.file && (
      <p className="text-green-600 font-semibold mt-2">✅ Surat sudah ditandatangani</p>
    )}
  </>
)}

      </div>
    </KepalaDesaLayout>
  );
}
