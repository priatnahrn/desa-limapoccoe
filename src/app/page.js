'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-200 flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Logo dan Branding */}
      <div className="flex flex-col items-center mb-12 text-center">
        <img
          src="https://cdn.digitaldesa.com/uploads/profil/73.09.10.2007/common/300_maros.png" // Ganti jika ada logo desa
          alt="Logo Desa Limapoccoe"
          width={100}
          height={100}
          className="mb-4"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">LIMAPOCCOE DIGITAL</h1>
        <p className="text-gray-700 text-lg sm:text-xl">
          Sistem Layanan Publik Desa Limapoccoe
        </p>
      </div>

      {/* Tombol Navigasi Role - vertikal */}
      <div className="flex flex-col gap-4 w-full sm:max-w-sm">
        <Link
          href="/login"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-center"
        >
          Masuk sebagai Masyarakat
        </Link>
        <Link
          href="/admin/login"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-center"
        >
          Masuk sebagai Admin
        </Link>
        <Link
          href="/kepala-desa/login"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-center"
        >
          Masuk sebagai Kepala Desa
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Desa Limapoccoe. All rights reserved.
      </footer>
    </div>
  );
}
