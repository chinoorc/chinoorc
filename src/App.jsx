import { useEffect, useMemo, useState } from 'react';

const defaultProducts = [
  {
    id: 1,
    nombre: 'Tomate orgánico',
    descripcion: 'Cultivado sin agroquímicos y cosechado en temporada.',
    precio: 2.75,
  },
  {
    id: 2,
    nombre: 'Acelga fresca',
    descripcion: 'Hojas tiernas, ideales para salteados o tartas.',
    precio: 1.9,
  },
  {
    id: 3,
    nombre: 'Miel natural',
    descripcion: 'Producción artesanal de apicultores locales.',
    precio: 6.5,
  },
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

function App() {
  const [productos, setProductos] = useState(defaultProducts);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/productos`);

        if (!response.ok) {
          throw new Error('No fue posible obtener productos desde la API.');
        }

        const data = await response.json();
        setProductos(Array.isArray(data) && data.length ? data : defaultProducts);
        setError('');
      } catch {
        setError('Mostrando catálogo de ejemplo. Configura la API para ver datos reales.');
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  const total = useMemo(
    () => productos.reduce((sum, producto) => sum + Number(producto.precio ?? 0), 0),
    [productos]
  );

  return (
    <main className="layout">
      <header>
        <p className="eyebrow">OrganicoSiOSi.API</p>
        <h1>Frontend base en React JS</h1>
        <p>
          Proyecto inicial para consumir el backend de OrganicoSiOSi con una interfaz moderna,
          liviana y fácil de escalar.
        </p>
      </header>

      <section className="panel">
        <h2>Catálogo de productos</h2>
        {cargando ? <p>Cargando catálogo...</p> : null}
        {error ? <p className="warning">{error}</p> : null}

        <div className="grid">
          {productos.map((producto) => (
            <article key={producto.id} className="card">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <strong>${Number(producto.precio).toFixed(2)}</strong>
            </article>
          ))}
        </div>

        <footer className="summary">
          <span>Productos: {productos.length}</span>
          <span>Valor estimado: ${total.toFixed(2)}</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
