"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [loadingSurat, setLoadingSurat] = useState(true);

  useEffect(() => {
    try {
      const user = localStorage.getItem("admin_user");
      const token = localStorage.getItem("admin_token");

      if (user && token) {
        setAdmin(JSON.parse(user));
        fetchJenisSurat(token);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Gagal parsing user login");
      localStorage.clear();
      router.push("/admin/login");
    }
  }, [router]);

  const fetchJenisSurat = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/surat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setJenisSurat(data.jenis_surat || []);
    } catch (error) {
      console.error("❌ Gagal ambil jenis surat untuk menu:", error);
    } finally {
      setLoadingSurat(false);
    }
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pengaduan", path: "/admin/aduan" },
    { name: "Data Penduduk", path: "/admin/penduduk" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        {admin ? (
          <div className="mb-6 text-sm text-gray-700 border-b pb-4">
            <p className="font-semibold">👤 {admin.name || admin.username}</p>
            <p className="text-xs text-gray-500">{admin.email || "-"}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-6">Memuat profil...</p>
        )}

        <nav className="space-y-2 text-sm">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded hover:bg-blue-100 ${
                pathname === item.path ? "bg-blue-500 text-white" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-4">
            <p className="font-semibold text-gray-600 mb-1">📄 Pembuatan Surat</p>
            {loadingSurat ? (
              <p className="text-xs text-gray-400 italic">Memuat surat...</p>
            ) : (
              <ul className="pl-2 space-y-1">
                {jenisSurat.map((surat) => (
                  <li key={surat.id}>
                    <Link
                      href={`/admin/surat/${surat.id}`}
                      className="block px-2 py-1 text-gray-700 rounded hover:bg-blue-100"
                    >
                      {surat.nama_surat}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/admin/login");
          }}
          className="mt-6 w-full text-sm text-red-600 hover:underline"
        >
          🔒 Logout
        </button>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
