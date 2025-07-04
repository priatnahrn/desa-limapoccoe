// proxy route
export async function POST(req) {
  const body = await req.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/login/masyarakat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
