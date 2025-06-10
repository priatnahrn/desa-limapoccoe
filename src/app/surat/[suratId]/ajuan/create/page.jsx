'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LayoutMasyarakat from '@/app/components/MasyarakatLayout' // sesuaikan path

const formSchemaBySuratKode = {
  SKTM: [
    { name: 'nama_ayah', label: 'Nama Ayah', type: 'text' },
    { name: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', type: 'text' },
    { name: 'nama_ibu', label: 'Nama Ibu', type: 'text' },
    { name: 'pekerjaan_ibu', label: 'Pekerjaan Ibu', type: 'text' },
    { name: 'jumlah_tanggungan', label: 'Jumlah Tanggungan', type: 'number' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
  ],
  SKU: [
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'nama_usaha', label: 'Nama Usaha', type: 'text' },
    { name: 'lokasi_usaha', label: 'Lokasi Usaha', type: 'text' },
  ],
  SKCK: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'suku_bangsa', label: 'Suku/Bangsa', type: 'text' },
    { name: 'agama', label: 'Agama', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
  ],
  BBM: [
    { name: 'nama', label: 'Nama', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
    { name: 'alamat_usaha', label: 'Alamat Usaha', type: 'text' },
    { name: 'konsumen', label: 'Konsumen/Pengguna', type: 'text' },
    { name: 'usaha', label: 'Usaha', type: 'text' },
    { name: 'jenis_alat', label: 'Jenis Alat', type: 'text' },
    { name: 'jumlah_alat', label: 'Jumlah Alat', type: 'number' },
    { name: 'fungsi_alat', label: 'Fungsi Alat', type: 'text' },
    { name: 'bbm_jenis', label: 'BBM Jenis Tertentu', type: 'text' },
    { name: 'kebutuhan_bbm', label: 'Kebutuhan BBM per jam/hari/minggu', type: 'text' },
    { name: 'jam_operasional', label: 'Jam/Hari Operasional', type: 'text' },
    { name: 'alokasi_bbm', label: 'Alokasi BBM (jam/hari/minggu/bulan)', type: 'text' },
    { name: 'tempat_pengambilan', label: 'Tempat Pengambilan', type: 'text' },
    { name: 'nomor_lembaga', label: 'Nomor Lembaga Penyalur', type: 'text' },
    { name: 'lokasi', label: 'Lokasi', type: 'text' },
  ],
  SKL: [
    { name: 'nama', label: 'Nama', type: 'text' },
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'pukul', label: 'Pukul', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'anak_ke', label: 'Anak ke-', type: 'number' },
    { name: 'nama_ayah', label: 'Nama Ayah', type: 'text' },
    { name: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', type: 'text' },
    { name: 'alamat_ayah', label: 'Alamat Ayah', type: 'text' },
    { name: 'nama_ibu', label: 'Nama Ibu', type: 'text' },
    { name: 'pekerjaan_ibu', label: 'Pekerjaan Ibu', type: 'text' },
    { name: 'alamat_ibu', label: 'Alamat Ibu', type: 'text' },
  ],
  SKH: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
  ],
  SKBN: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'suku_bangsa', label: 'Suku/Bangsa', type: 'text' },
    { name: 'agama', label: 'Agama', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
  ],
  SKM: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat Tanggal Lahir / Umur', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
    { name: 'mahar', label: 'Mahar', type: 'text' },
  ],
  SKN: [
    { name: 'nama_laki', label: 'Nama Laki-laki', type: 'text' },
    { name: 'nik_laki', label: 'NIK (Laki-laki)', type: 'text' },
    { name: 'ttl_laki', label: 'Tempat, Tanggal Lahir (Laki-laki)', type: 'text' },
    { name: 'pekerjaan_laki', label: 'Pekerjaan (Laki-laki)', type: 'text' },
    { name: 'alamat_laki', label: 'Alamat (Laki-laki)', type: 'text' },
    { name: 'nama_perempuan', label: 'Nama Perempuan', type: 'text' },
    { name: 'nik_perempuan', label: 'NIK (Perempuan)', type: 'text' },
    { name: 'ttl_perempuan', label: 'Tempat, Tanggal Lahir (Perempuan)', type: 'text' },
    { name: 'pekerjaan_perempuan', label: 'Pekerjaan (Perempuan)', type: 'text' },
    { name: 'alamat_perempuan', label: 'Alamat (Perempuan)', type: 'text' },
    { name: 'tanggal_nikah', label: 'Hari, Tanggal Pernikahan', type: 'text' },
    { name: 'mas_kawin', label: 'Mas Kawin', type: 'text' },
    { name: 'saksi', label: 'Saksi-saksi', type: 'text' },
  ],
  SKP: [
    { name: 'nama', label: 'Nama', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'agama', label: 'Agama', type: 'text' },
    { name: 'nama_ayah', label: 'Nama Ayah', type: 'text' },
    { name: 'alamat_ayah', label: 'Alamat Ayah', type: 'text' },
    { name: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', type: 'text' },
    { name: 'penghasilan_ayah', label: 'Penghasilan per Bulan Ayah', type: 'text' },
    { name: 'nama_ibu', label: 'Nama Ibu', type: 'text' },
    { name: 'alamat_ibu', label: 'Alamat Ibu', type: 'text' },
    { name: 'pekerjaan_ibu', label: 'Pekerjaan Ibu', type: 'text' },
    { name: 'penghasilan_ibu', label: 'Penghasilan per Bulan Ibu', type: 'text' },
  ],
  SKD: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
  ],
  SKBR: [
    { name: 'tempat_tanggal_lahir', label: 'Tempat, Tanggal Lahir', type: 'text' },
    { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text' },
    { name: 'agama', label: 'Agama', type: 'text' },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
    { name: 'nik', label: 'NIK', type: 'text' },
    { name: 'alamat', label: 'Alamat', type: 'text' },
  ]
}


export default function CreateAjuanPage() {
  const { suratId } = useParams()
  const router = useRouter()

  const [formKey, setFormKey] = useState(null)
  const [formData, setFormData] = useState({})
  const [lampiran, setLampiran] = useState(null)
  const [profileInfo, setProfileInfo] = useState({})
  const [isReady, setIsReady] = useState(false)

  const fields = formSchemaBySuratKode[formKey] || []

  useEffect(() => {
    const fetchSuratAndProfile = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) return alert('⚠️ Token tidak ditemukan. Silakan login.')

      try {
        const suratRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/surat/${suratId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const suratJson = await suratRes.json()
        setFormKey(suratJson?.jenis_surat?.kode_surat)

        const profilRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/cek-profil/masyarakat`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const profilJson = await profilRes.json()

        if (profilJson?.profile && profilJson?.user) {
          setProfileInfo({
            name: profilJson.user.name,
            nik: profilJson.user.nik,
            tempat_lahir: profilJson.profile.tempat_lahir,
            tanggal_lahir: profilJson.profile.tanggal_lahir,
            jenis_kelamin: profilJson.profile.jenis_kelamin,
            alamat: profilJson.profile.alamat,
          })
          setFormData({})
          setIsReady(true)
        } else {
          alert('Gagal memuat data profil.')
        }
      } catch (err) {
        console.error('❌ Gagal fetch:', err)
        alert('Gagal mengambil data. Silakan coba lagi.')
      }
    }

    if (suratId) fetchSuratAndProfile()
  }, [suratId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('access_token')
    if (!token) return alert('Token tidak tersedia.')

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(`data_surat[${key}]`, value)
    })
    if (lampiran) data.append('lampiran', lampiran)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajuan-surat/masyarakat/${suratId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: data,
      })

      const result = await res.json()
      if (!res.ok) {
        console.error('❌ Respon Gagal:', result)
        return alert(`❌ Gagal: ${result.message || 'Terjadi kesalahan.'}`)
      }

      alert('✅ Pengajuan berhasil dikirim!')
      router.push(`/surat/${suratId}`)
    } catch (err) {
      console.error('❌ Gagal submit:', err)
      alert('Gagal mengirim pengajuan.')
    }
  }

  return (
    <LayoutMasyarakat>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold mb-6">📝 Form Pengajuan Surat</h2>

        {!isReady ? (
          <p className="text-gray-500">⏳ Memuat data formulir...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 👤 Informasi Profil */}
            <fieldset className="border rounded p-4 bg-gray-50">
              <legend className="text-sm font-semibold text-gray-700">👤 Informasi Profil</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {Object.entries(profileInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    <input
                      type="text"
                      value={value || '-'}
                      disabled
                      className="w-full border bg-gray-100 text-gray-800 px-3 py-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            {/* 📝 Form Surat */}
            {fields.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">📋 Data Tambahan</h3>
                <div className="space-y-4">
                  {fields.map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📎 Lampiran */}
            <div>
              <label className="block text-sm font-medium mb-1">📎 Lampiran (opsional)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setLampiran(e.target.files[0])}
                className="w-full"
              />
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-semibold">
                🚀 Ajukan Surat
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutMasyarakat>
  )
}
