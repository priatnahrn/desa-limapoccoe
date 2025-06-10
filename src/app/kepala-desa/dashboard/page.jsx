"use client";

import KepalaDesaLayout from "@/app/components/KepalaDesaLayout";

export default function DashboardKepalaDesa() {
  return (
    <KepalaDesaLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Kepala Desa</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">📄 Total Pengajuan Surat</h2>
            <p className="text-3xl font-bold text-blue-600">23</p>
            <p className="text-sm text-gray-500">Pengajuan yang menunggu persetujuan</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">📢 Total Pengaduan</h2>
            <p className="text-3xl font-bold text-red-600">5</p>
            <p className="text-sm text-gray-500">Pengaduan baru dari masyarakat</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">📌 Ringkasan Tindakan</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>3 surat telah dikonfirmasi hari ini</li>
            <li>1 pengaduan telah ditanggapi</li>
            <li>2 surat menunggu tanda tangan</li>
          </ul>
        </div>
      </div>
    </KepalaDesaLayout>
  );
}
