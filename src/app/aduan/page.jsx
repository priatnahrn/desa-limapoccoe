'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import LayoutMasyarakat from '../components/MasyarakatLayout' // sesuaikan path layout kamu

export default function AduanListPage() {
  const [aduanList, setAduanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchAduan = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAduanList(response.data.aduan || [])
      } catch (err) {
        setError('Gagal memuat data aduan. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchAduan()
  }, [])

  const formatDate = (dateStr) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  }

  return (
    <LayoutMasyarakat>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">📣 Daftar Pengaduan Anda</h1>
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:underline mt-1"
            >
              ← Kembali
            </button>
          </div>
          <button
            onClick={() => router.push('/aduan/create')}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded font-medium"
          >
            + Tambah Pengaduan
          </button>
        </div>

        {/* Konten */}
        {loading ? (
          <p className="text-gray-500">⏳ Memuat data aduan...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">📅 Tanggal</th>
                  <th className="px-4 py-2 border">🏷️ Kategori</th>
                  <th className="px-4 py-2 border">📌 Status</th>
                  <th className="px-4 py-2 border">⚙️ Aksi</th>
                </tr>
              </thead>
              <tbody>
                {aduanList.map((aduan) => (
                  <tr key={aduan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{formatDate(aduan.created_at)}</td>
                    <td className="px-4 py-2 border">{aduan.category}</td>
                    <td className="px-4 py-2 border capitalize">{aduan.status}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => router.push(`/aduan/${aduan.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {aduanList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500 italic">
                      Tidak ada pengaduan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutMasyarakat>
  )
}
