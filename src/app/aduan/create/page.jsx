'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LayoutMasyarakat from '@/app/components/MasyarakatLayout' // Sesuaikan path-nya

export default function TambahAduanPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    content: '',
    location: '',
    category: '',
    evidence: null,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Administrasi',
    'Infrastruktur & Fasilitas',
    'Kesehatan',
    'Keamanan & Ketertiban',
    'Pendidikan',
    'Lingkungan',
    'Kinerja Perangkat Desa',
    'Ekonomi & Pekerjaan',
    'Teknologi',
    'Lainnya',
  ]

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'evidence') {
      setForm({ ...form, evidence: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('access_token')
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('location', form.location)
    formData.append('category', form.category)
    if (form.evidence) {
      formData.append('evidence', form.evidence)
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/aduan/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errRes = await res.json()
        throw new Error(errRes.error || 'Gagal mengirim aduan.')
      }

      alert('✅ Aduan berhasil dikirim.')
      router.push('/aduan')
    } catch (err) {
      console.error(err)
      alert('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/aduan')
  }

  return (
    <LayoutMasyarakat>
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold text-green-800 mb-6">📝 Tambah Aduan Masyarakat</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Aduan</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Aduan</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lokasi (Opsional)</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori Aduan</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bukti Gambar (Opsional)</label>
            <input
              type="file"
              name="evidence"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              ← Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              {loading ? 'Mengirim...' : 'Kirim Aduan'}
            </button>
          </div>
        </form>
      </div>
    </LayoutMasyarakat>
  )
}
