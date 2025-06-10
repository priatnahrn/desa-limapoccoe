'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LayoutMasyarakat from '@/app/components/MasyarakatLayout' // pastikan path sesuai

export default function SuratDetailPage() {
  const { suratId } = useParams()
  const router = useRouter()
  const [surat, setSurat] = useState(null)
  const [ajuanList, setAjuanList] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const fetchData = async () => {
      try {
        const suratRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/surat/${suratId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const suratData = await suratRes.json()
        setSurat(suratData.jenis_surat)

        const ajuanRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/masyarakat/${suratId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const ajuanJson = await ajuanRes.json()
        setAjuanList(ajuanJson.ajuan_surat || [])
      } catch (err) {
        console.error('⚠️ Gagal mengambil data:', err)
      }
    }

    if (suratId) fetchData()
  }, [suratId])

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    })
  }

  const maskNomorSurat = (nomor) => {
    if (!nomor) return '-'
    const parts = nomor.split('/')
    return parts.length >= 3 ? `.../${parts.slice(-2).join('/')}` : nomor
  }

  return (
    <LayoutMasyarakat>
      <div className="bg-white shadow rounded p-6 space-y-8">
        {/* Navigasi dan Aksi */}
        <div className="flex justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            🔙 Kembali
          </button>
          <button
            onClick={() => router.push(`/surat/${suratId}/ajuan/create`)}
            className="bg-green-600 text-sm text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Tambah Pengajuan Baru
          </button>
        </div>

        {/* Detail Surat */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📄 Detail Surat</h2>
          {surat ? (
            <>
              <p className="text-xl font-semibold">{surat.nama_surat}</p>
              <p className="text-gray-700 mt-2">{surat.deskripsi}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">📎 Syarat & Ketentuan:</h3>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {surat.syarat_ketentuan?.split(',').map((item, i) => (
                    <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>🔄 Memuat detail surat...</p>
          )}
        </section>

        {/* Tabel Ajuan */}
        <section>
          <h3 className="text-xl font-bold mb-3">📑 Daftar Pengajuan Saya</h3>
          {ajuanList.length > 0 ? (
            <div className="overflow-x-auto border rounded">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b">📅 Tanggal Ajuan</th>
                    <th className="p-2 border-b">📄 Nomor Surat</th>
                    <th className="p-2 border-b">📌 Status</th>
                    <th className="p-2 border-b">⚙️ Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {ajuanList.map((ajuan) => (
                    <tr key={ajuan.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{formatTanggal(ajuan.created_at)}</td>
                      <td className="p-2 border-b">{maskNomorSurat(ajuan.nomor_surat)}</td>
                      <td className="p-2 border-b capitalize">{ajuan.status}</td>
                      <td className="p-2 border-b">
                        <button
                          onClick={() => router.push(`/surat/${suratId}/ajuan/${ajuan.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Belum ada pengajuan untuk surat ini.</p>
          )}
        </section>
      </div>
    </LayoutMasyarakat>
  )
}
