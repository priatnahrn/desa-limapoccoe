'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyOtpPage() {
  const [otp_code, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const registration_token = localStorage.getItem('registration_token')
    if (!registration_token) {
      setMessage('❌ Token registrasi tidak ditemukan. Silakan daftar ulang.')
      setTimeout(() => {
        router.push('/register')
      }, 2500)
    }
  }, [router])

  const handleSubmit = async e => {
    e.preventDefault()
    const registration_token = localStorage.getItem('registration_token')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ registration_token, otp_code }),
      })

      const data = await res.json()

      if (res.status === 422) {
        setMessage('⚠️ Validasi gagal. Pastikan OTP 6 digit dan token valid.')
        return
      }

      if (!res.ok) {
        setMessage(data.message || '❌ Gagal verifikasi OTP.')
        return
      }

      localStorage.clear()
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setMessage('✅ OTP berhasil diverifikasi!')
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('❌ Error saat verifikasi OTP:', err)
      setMessage('Terjadi kesalahan koneksi. Coba lagi.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-2">🔐 Verifikasi OTP</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Masukkan kode OTP yang dikirimkan ke WhatsApp Anda.
        </p>

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded text-sm text-center">
            {message}
          </div>
        )}

        {!success && message && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="otp_code"
            type="text"
            maxLength={6}
            placeholder="Masukkan Kode OTP"
            value={otp_code}
            onChange={e => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg tracking-widest"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition"
          >
            Verifikasi
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum menerima kode? <a href="/register" className="text-green-700 hover:underline font-medium">Daftar ulang</a>
        </div>
      </div>
    </div>
  )
}
