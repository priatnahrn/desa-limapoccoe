'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LayoutMasyarakat from '@/app/components/MasyarakatLayout'

export default function DetailAjuanSuratPage() {
  const { suratId, ajuanId } = useParams()
  const router = useRouter()
  const [ajuan, setAjuan] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    const fetchDetailAjuan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/masyarakat/${suratId}/${ajuanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        )
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const json = await res.json()
        setAjuan(json.ajuan_surat)
      } catch (err) {
        console.error('⚠️ Gagal fetch detail ajuan:', err)
      }
    }

    if (suratId && ajuanId) fetchDetailAjuan()
  }, [suratId, ajuanId])

 

return (
  <LayoutMasyarakat>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📄 Detail Pengajuan Surat</h2>

      {!ajuan ? (
        <p>🔄 Memuat data ajuan...</p>
      ) : (
        <>
          {/* 👤 Informasi Pengaju */}
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">👤 Data Pengaju:</h3>
            <ul className="text-sm text-gray-800 list-inside list-disc">
              <li><strong>Nama:</strong> {ajuan.user?.name || '-'}</li>
              <li><strong>NIK:</strong> {ajuan.user?.nik || '-'}</li>
              <li><strong>Tempat/Tanggal Lahir:</strong> {ajuan.user?.profile?.tempat_lahir || '-'} / {ajuan.user?.profile?.tanggal_lahir || '-'}</li>
              <li><strong>Jenis Kelamin:</strong> {ajuan.user?.profile?.jenis_kelamin || '-'}</li>
              <li><strong>Alamat:</strong> {ajuan.user?.profile?.alamat || '-'}</li>
            </ul>
          </div>

          {/* 📝 Informasi Ajuan */}
          <div className="mb-6">
            <p className="mb-2"><strong>Status:</strong> {ajuan.status}</p>
            <p className="mb-2"><strong>Nomor Surat:</strong> {ajuan.nomor_surat || '-'}</p>
            <p className="mb-2"><strong>Lampiran:</strong> {Array.isArray(ajuan.lampiran) ? ajuan.lampiran.map((file, idx) => (
              <a
                key={idx}
                href={`${process.env.NEXT_PUBLIC_FILE_URL}/${file}`}
                className="text-blue-600 underline mr-2"
                target="_blank"
              >
                File {idx + 1}
              </a>
            )) : '-'}</p>
          </div>

          {/* 📋 Formulir */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📋 Data Formulir Pengajuan:</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {Object.entries(JSON.parse(ajuan.data_surat || '{}')).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.replaceAll('_', ' ')}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              ⬅️ Kembali
            </button>
          </div>
        </>
      )}
    </div>
  </LayoutMasyarakat>
)

  
}
