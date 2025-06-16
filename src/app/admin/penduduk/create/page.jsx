'use client';

import { useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TambahPendudukPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nik: '',
    nomor_kk: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    rt_rw: '',
    dusun: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten_kota: '',
    provinsi: '',
    status_perkawinan: '',
    agama: '',
    pendidikan_terakhir: '',
    pekerjaan: '',
    kewarganegaraan: '',
    golongan_darah: '',
    status_kependudukan: '',
    status_kehidupan: '',
    tanggal_meninggal: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const err = {};
    if (!form.nik || form.nik.length !== 16) err.nik = 'NIK harus 16 digit';
    if (!form.nomor_kk || form.nomor_kk.length !== 16) err.nomor_kk = 'Nomor KK harus 16 digit';
    if (!form.nama_lengkap) err.nama_lengkap = 'Nama lengkap wajib diisi';
    if (!form.jenis_kelamin) err.jenis_kelamin = 'Pilih jenis kelamin';
    if (!form.tempat_lahir) err.tempat_lahir = 'Tempat lahir wajib diisi';
    if (!form.tanggal_lahir) err.tanggal_lahir = 'Tanggal lahir wajib diisi';
    if (!form.alamat) err.alamat = 'Alamat wajib diisi';
    if (!form.dusun) err.dusun = 'Pilih dusun';
    if (!form.kelurahan) err.kelurahan = 'Kelurahan wajib diisi';
    if (!form.kecamatan) err.kecamatan = 'Kecamatan wajib diisi';
    if (!form.kabupaten_kota) err.kabupaten_kota = 'Kabupaten/Kota wajib diisi';
    if (!form.provinsi) err.provinsi = 'Provinsi wajib diisi';
    if (!form.status_perkawinan) err.status_perkawinan = 'Pilih status perkawinan';
    if (!form.agama) err.agama = 'Pilih agama';
    if (!form.kewarganegaraan) err.kewarganegaraan = 'Pilih kewarganegaraan';
    if (!form.status_kependudukan) err.status_kependudukan = 'Pilih status kependudukan';
    if (!form.status_kehidupan) err.status_kehidupan = 'Pilih status kehidupan';
    return err;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff-desa/penduduk/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data?.error || 'Gagal menyimpan data.' });
        return;
      }

      setSuccessMessage('✅ Data berhasil disimpan!');
      setTimeout(() => {
        router.push('/admin/penduduk');
      }, 1500);
    } catch (err) {
      setErrors({ form: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">📝 Tambah Penduduk</h1>
          <Link href="/admin/penduduk" className="text-sm text-blue-600 hover:underline">
            ← Kembali
          </Link>
        </div>

        {errors.form && <div className="text-red-600 mb-4">{errors.form}</div>}
        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="NIK" name="nik" value={form.nik} onChange={handleChange} error={errors.nik} required />
          <Input label="Nomor KK" name="nomor_kk" value={form.nomor_kk} onChange={handleChange} error={errors.nomor_kk} required />
          <Input label="Nama Lengkap" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} error={errors.nama_lengkap} required />
          <Select label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} error={errors.jenis_kelamin} options={['Laki-laki', 'Perempuan']} />
          <Input label="Tempat Lahir" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} error={errors.tempat_lahir} required />
          <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={handleChange} error={errors.tanggal_lahir} required />
          <Input label="Alamat" name="alamat" value={form.alamat} onChange={handleChange} error={errors.alamat} required />
          <Input label="RT/RW" name="rt_rw" value={form.rt_rw} onChange={handleChange} />
          <Select label="Dusun" name="dusun" value={form.dusun} onChange={handleChange} error={errors.dusun} options={['WT.Bengo', 'Barua', 'Mappasaile', 'Kampala', 'Kaluku', 'Jambua', 'Bontopanno', 'Samata']} />
          <Input label="Kelurahan" name="kelurahan" value={form.kelurahan} onChange={handleChange} error={errors.kelurahan} />
          <Input label="Kecamatan" name="kecamatan" value={form.kecamatan} onChange={handleChange} error={errors.kecamatan} />
          <Input label="Kabupaten/Kota" name="kabupaten_kota" value={form.kabupaten_kota} onChange={handleChange} error={errors.kabupaten_kota} />
          <Input label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} error={errors.provinsi} />
          <Select label="Status Perkawinan" name="status_perkawinan" value={form.status_perkawinan} onChange={handleChange} error={errors.status_perkawinan} options={['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']} />
          <Select label="Agama" name="agama" value={form.agama} onChange={handleChange} error={errors.agama} options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']} />
          <Select label="Pendidikan Terakhir" name="pendidikan_terakhir" value={form.pendidikan_terakhir} onChange={handleChange} options={['Tidak/Belum Sekolah', 'Belum Tamat SD/Sederajat', 'Tamat SD/Sederajat', 'SLTP/Sederajat', 'SLTA/Sederajat', 'D-1/D-2', 'D-3', 'S-1', 'S-2', 'S-3']} />
          <Input label="Pekerjaan" name="pekerjaan" value={form.pekerjaan} onChange={handleChange} />
          <Select label="Kewarganegaraan" name="kewarganegaraan" value={form.kewarganegaraan} onChange={handleChange} error={errors.kewarganegaraan} options={['WNI', 'WNA']} />
          <Select label="Golongan Darah" name="golongan_darah" value={form.golongan_darah} onChange={handleChange} options={['A', 'B', 'AB', 'O']} />
          <Select label="Status Kependudukan" name="status_kependudukan" value={form.status_kependudukan} onChange={handleChange} error={errors.status_kependudukan} options={['Aktif', 'Tidak Aktif']} />
          <Select label="Status Kehidupan" name="status_kehidupan" value={form.status_kehidupan} onChange={handleChange} error={errors.status_kehidupan} options={['Hidup', 'Meninggal']} />
          <Input label="Tanggal Meninggal" name="tanggal_meninggal" type="date" value={form.tanggal_meninggal} onChange={handleChange} />

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Komponen bantu input & select dengan error
function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className={`w-full border px-3 py-2 rounded text-sm ${error ? 'border-red-500' : ''}`} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, options = [], error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...props} className={`w-full border px-3 py-2 rounded text-sm ${error ? 'border-red-500' : ''}`}>
        <option value="">-- Pilih --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
