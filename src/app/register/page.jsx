'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [form, setForm] = useState({
    name: '',
    nik: '',
    no_whatsapp: '',
    password: '',
    password_confirmation: '',
  })
  const [message, setMessage] = useState('')
  const [successPopup, setSuccessPopup] = useState(false)

  const router = useRouter()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
  e.preventDefault()
  setMessage('')

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.message || '❌ Gagal mendaftar.')
      return
    }

    localStorage.clear()
    localStorage.setItem('registration_token', data.registration_token)

    setSuccessPopup(true)
    setTimeout(() => {
      setSuccessPopup(false)
      router.push('/verify-otp')
    }, 1500)

  } catch (err) {
    console.error('❌ Error:', err)
    setMessage('Terjadi kesalahan. Coba lagi nanti.')
  }
}




  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-2">📝 Registrasi Akun</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Buat akun untuk menggunakan layanan desa.</p>

{successPopup && (
  <div className="mb-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
    ✅ Registrasi berhasil! Silakan verifikasi OTP.
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="nik"
            type="text"
            placeholder="NIK (16 digit)"
            value={form.nik}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="no_whatsapp"
            type="text"
            placeholder="Nomor WhatsApp Aktif"
            value={form.no_whatsapp}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Kata Sandi"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password_confirmation"
            type="password"
            placeholder="Konfirmasi Kata Sandi"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition"
          >
            Daftar Sekarang
          </button>

          {message && (
            <div className="mt-3 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-green-700 hover:underline font-medium">
            Masuk di sini
          </a>
        </div>
      </div>
    </div>
  )
}
