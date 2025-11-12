export async function obtenerTopologias(elementos) {

  const url = `http://localhost:8000/topologias`;
  console.log("ruta",url)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
