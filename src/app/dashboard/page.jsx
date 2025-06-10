import LayoutMasyarakat from "../components/MasyarakatLayout"

export default function DashboardPage() {
  return (
    <LayoutMasyarakat>
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-2">Selamat Datang</h2>
        <p className="text-gray-600">Silakan pilih menu di sidebar untuk mulai menggunakan layanan.</p>
      </div>
    </LayoutMasyarakat>
  )
}
