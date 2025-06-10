// 📁 File: app/api/proxy-preview/[ajuanId]/route.js
export async function GET(request, { params }) {
  const { ajuanId } = params;
  const suratId = request.nextUrl.searchParams.get("suratId");
  const token = request.headers.get("authorization");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(`${process.env.PUBLIC_STORAGE_URL}/preview-surat/${suratId}/${ajuanId}`, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'text/html',
    },
  });

  const html = await res.text();

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: res.status,
  });
}
