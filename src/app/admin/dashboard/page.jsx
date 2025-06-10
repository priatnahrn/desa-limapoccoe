import AdminLayout from "@/app/components/AdminLayout";
export default function DashboardPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Selamat Datang di Dashboard Admin</h1>
      <p className="mt-4 text-gray-600">Gunakan menu di sebelah kiri untuk mengelola sistem.</p>
    </AdminLayout>
  );
}
