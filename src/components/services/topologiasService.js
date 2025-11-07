export async function obtenerTopologias(elementos) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/topologias`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY
      },
      body: JSON.stringify({ elementos })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching topologias:', err);
    throw err;
  }
}
