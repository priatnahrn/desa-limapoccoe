'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import LayoutMasyarakat from '@/app/components/MasyarakatLayout' // Sesuaikan path

export default function AduanDetailPage() {
  const [aduan, setAduan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { aduanId } = useParams()

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/detail/${aduanId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAduan(response.data.aduan)
      } catch (err) {
        setError('Gagal memuat detail aduan.')
      } finally {
        setLoading(false)
      }
    }

    if (aduanId) fetchDetail()
  }, [aduanId])

  const formatDate = (dateStr) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  }

  return (
    <LayoutMasyarakat>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:underline mb-4"
        >
          ← Kembali ke daftar aduan
        </button>

        {loading ? (
          <p className="text-gray-500">⏳ Memuat detail aduan...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-800 mb-2">{aduan.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              📅 {formatDate(aduan.created_at)} • 🏷️ Kategori: {aduan.category}
            </p>

            <p className="mb-4 text-gray-800">{aduan.content}</p>

            {aduan.location && (
              <p className="mb-2">
                <strong>📍 Lokasi:</strong> {aduan.location}
              </p>
            )}

            <p className="mb-2">
              <strong>📌 Status:</strong>{' '}
              <span className="capitalize">{aduan.status}</span>
            </p>

            {/* 🔁 Tanggapan Admin */}
            {aduan.response && (
              <div className="p-4 border border-green-200 bg-green-50 rounded mb-5">
                <p className="text-sm font-semibold text-green-800 mb-2">📣 Tanggapan dari Admin:</p>
                <p className="text-sm text-gray-800 whitespace-pre-line">{aduan.response}</p>

                <div className="mt-2 text-xs text-gray-600">
                  <p><strong>👤 Penanggap:</strong> {aduan.response_by_name || '-'}</p>
                  <p><strong>📅 Tanggal:</strong> {aduan.response_date ? new Date(aduan.response_date).toLocaleDateString('id-ID') : '-'}</p>
                </div>
              </div>
            )}

            {/* 🖼️ Bukti Gambar */}
            {aduan.evidence && (
              <div className="mt-6">
                <p className="font-semibold mb-2">🖼️ Bukti Foto:</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api/v1', '')}/storage/${aduan.evidence}`}
                  alt="Bukti Aduan"
                  className="rounded shadow max-w-full h-auto border"
                />
              </div>
            )}
          </>
        )}
      </div>
    </LayoutMasyarakat>
  )
}
