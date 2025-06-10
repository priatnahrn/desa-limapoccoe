'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/app/components/AdminLayout';

export default function SuratDetailPage() {
  const { suratId } = useParams();
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/admin/${suratId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();
        setPengajuanList(data.ajuan_surat || []);
      } catch (error) {
        console.error('❌ Gagal ambil pengajuan surat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [suratId]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Daftar Pengajuan Surat</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : pengajuanList.length === 0 ? (
        <p>Tidak ada pengajuan untuk surat ini.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama Pengaju</th>
                <th className="px-4 py-3">Nomor Surat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengajuanList.map((ajuan, index) => (
                <tr key={ajuan.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{ajuan.user?.name || '-'}</td>
                  <td className="px-4 py-2">{ajuan.nomor_surat || '-'}</td>
                  <td className="px-4 py-2 capitalize">{ajuan.status}</td>
                  <td className="px-4 py-2">{new Date(ajuan.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/surat/${suratId}/ajuan/${ajuan.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
