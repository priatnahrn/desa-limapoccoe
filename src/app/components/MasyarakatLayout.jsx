'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LayoutMasyarakat({ children }) {
  const [user, setUser] = useState(null)
  const [jenisSurat, setJenisSurat] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      setUser(JSON.parse(userData))

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/surat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setJenisSurat(data.jenis_surat || [])
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } catch (e) {
      console.error('User data parsing failed:', e)
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-4 hidden sm:block">
        <h2 className="text-2xl font-bold mb-6">LimapoccoeDigital</h2>
        <nav className="space-y-3">
          <button onClick={() => router.push('/dashboard')} className="w-full text-left hover:bg-green-700 px-3 py-2 rounded">
            🏠 Dashboard
          </button>

          <div>
            <p className="font-semibold">📄 Pembuatan Surat</p>
            {loading ? (
              <p className="text-sm italic text-gray-300 mt-1">⏳ Memuat...</p>
            ) : (
              <ul className="pl-3 space-y-1 mt-1">
                {jenisSurat.map(surat => (
                  <li key={surat.id}>
                    <button
                      onClick={() => router.push(`/surat/${surat.id}`)}
                      className="text-left text-sm hover:bg-green-700 px-2 py-1 rounded w-full"
                    >
                      {surat.nama_surat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => router.push('/aduan')} className="w-full text-left hover:bg-green-700 px-3 py-2 rounded">
            📣 Pengaduan
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-green-900">Dashboard Masyarakat</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">👤 {user.name}</span>
              <button onClick={handleLogout} className="text-xs bg-red-600 text-white px-3 py-1 rounded">
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
