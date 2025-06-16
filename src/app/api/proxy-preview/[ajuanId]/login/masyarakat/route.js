// src/app/api/login/masyarakat/route.js

export async function POST(req) {
  const body = await req.json();

  try {
    const response = await fetch('https://quiet-pans-appear.loca.lt/api/v1/login/masyarakat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(text, { status: response.status });
    }
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Proxy error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
