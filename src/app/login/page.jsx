'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ nik: '', password: '' })
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const router = useRouter()

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined })) // reset field error saat diketik
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')
    setErrors({})

    try {
      const res = await fetch(`${baseURL}/login/masyarakat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        // Tangani error validasi dari backend
        if (data.errors) setErrors(data.errors)
        setMessage(data.message || 'Terjadi kesalahan saat login.')
        return
      }

      if (data.access_token) {
        localStorage.clear()
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        setShowSuccessPopup(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error('Login error:', err)
      setMessage('Terjadi kesalahan saat login. Silakan coba lagi.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative">
        {/* Judul */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-green-800">Masuk Masyarakat</h2>
          <p className="text-sm text-gray-600">Sistem Layanan Publik Desa Limapoccoe</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div>
            <input
              type="text"
              name="nik"
              placeholder="Masukkan NIK"
              value={form.nik}
              onChange={handleChange}
              required
              className={`w-full border ${
                errors.nik ? 'border-red-500' : 'border-gray-300'
              } px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
            />
            {errors.nik && (
              <p className="text-sm text-red-600 mt-1">{errors.nik[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Masukkan Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition"
          >
            Masuk
          </button>
        </form>

        {/* General Message */}
        {message && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mt-[2px] flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Link Daftar */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Daftar sekarang
            </a>
          </p>
        </div>

        {/* ✅ Modal Notifikasi Sukses Login */}
{showSuccessPopup && (
  <div className="fixed top-6 right-6 z-50">
    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow-lg max-w-sm w-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Login Berhasil!</h3>
          <p className="text-xs mt-1">Mengalihkan ke dashboard...</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mt-[2px] text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  )
}
