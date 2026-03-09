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

const TOKEN_STORAGE_KEY = 'organicosiosi_token';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5001';

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return payload.token ?? payload.jwtToken ?? payload.accessToken ?? '';
}

function App() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [productosError, setProductosError] = useState('');

  useEffect(() => {
    if (!token) {
      setProductos([]);
      return;
    }

    const fetchProductos = async () => {
      setCargandoProductos(true);
      setProductosError('');

      try {
        const response = await fetch(`${apiBaseUrl}/api/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No fue posible obtener productos desde la API.');
        }

        const data = await response.json();
        setProductos(Array.isArray(data) && data.length ? data : defaultProducts);
      } catch {
        setProductos(defaultProducts);
        setProductosError('No se pudo obtener el catálogo autenticado. Mostrando datos de ejemplo.');
      } finally {
        setCargandoProductos(false);
      }
    };

    fetchProductos();
  }, [token]);

  const total = useMemo(
    () => productos.reduce((sum, producto) => sum + Number(producto.precio ?? 0), 0),
    [productos]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/users/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña inválidos.');
      }

      const payload = await response.json();
      const authToken = extractToken(payload);

      if (!authToken) {
        throw new Error('La API no devolvió un token válido.');
      }

      sessionStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      setToken(authToken);
      setPassword('');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setUsuario('');
    setPassword('');
    setLoginError('');
  };

  return (
    <main className="layout">
      <header>
        <p className="eyebrow">OrganicoSiOSi.API</p>
        <h1>Frontend base en React JS</h1>
        <p>Autenticación con token y sesión activa mientras la pestaña permanece abierta.</p>
      </header>

      {!token ? (
        <section className="panel auth-panel">
          <h2>Iniciar sesión</h2>
          <p>Ingresá tus credenciales para consumir la API.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Usuario
              <input
                type="text"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                placeholder="usuario"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? 'Validando...' : 'Ingresar'}
            </button>

            {loginError ? <p className="warning">{loginError}</p> : null}
          </form>
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head">
            <h2>Catálogo de productos</h2>
            <button className="secondary" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>

          {cargandoProductos ? <p>Cargando catálogo...</p> : null}
          {productosError ? <p className="warning">{productosError}</p> : null}

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
      )}
    </main>
  );
}

export default App;
