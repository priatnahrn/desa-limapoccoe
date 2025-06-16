"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/app/components/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PendudukPage() {
  const [penduduks, setPenduduks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const fetchPenduduks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        console.log(data);
        setPenduduks(data.penduduks || []);
      } catch (err) {
        console.error("❌ Gagal mengambil data penduduk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPenduduks();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">👥 Daftar Penduduk</h1>
        <Link
          href="/admin/penduduk/import"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          ⬆️ Import Excel
        </Link>
        <Link
          href="/admin/penduduk/create"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          + Tambah Data
        </Link>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : penduduks.length === 0 ? (
        <p>Tidak ada data penduduk.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">NIK</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Jenis Kelamin</th>
                <th className="px-4 py-3">Dusun</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {penduduks.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.nik}</td>
                  <td className="px-4 py-2">{item.nama_lengkap}</td>
                  <td className="px-4 py-2">{item.jenis_kelamin}</td>
                  <td className="px-4 py-2">{item.dusun}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs text-white rounded ${
                        item.status_kependudukan === "Aktif"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {item.status_kependudukan}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/penduduk/${item.id}`}
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
    </AdminLayout>
  );
}
