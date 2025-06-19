'use client';

import { useEffect, useState } from 'react';
import KepalaDesaLayout from '@/app/components/KepalaDesaLayout';
import Link from 'next/link';

export default function PengaduanPage() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kepala_desa_token');
    if (!token) return;

    const fetchPengaduan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();
        console.log(data);
        setPengaduan(data.aduan || []);
      } catch (err) {
        console.error('❌ Gagal mengambil data pengaduan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPengaduan();
  }, []);

  return (
    <KepalaDesaLayout>
      <h1 className="text-2xl font-bold mb-4">📢 Daftar Pengaduan</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : pengaduan.length === 0 ? (
        <p>Tidak ada data pengaduan.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama Pengadu</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengaduan.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.user?.name || '-'}</td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs text-white rounded ${
                      item.status === 'waiting'
                        ? 'bg-yellow-500'
                        : item.status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-green-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/kepala-desa/aduan/${item.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </KepalaDesaLayout>
  );
}
