# OrganicoSiOSi Frontend (React)

Repositorio dedicado del frontend en **React + Vite** para consumir `OrganicoSiOSi.API`.

## Requisitos

- Node.js 18+
- npm 9+

## Configuración

1. Copiar variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Confirmar la URL del backend local en `.env`:

   ```env
   VITE_API_BASE_URL=https://localhost:5001
   ```

> La API usa HTTPS local. Si el certificado es self-signed, aceptalo en el navegador para evitar bloqueos.

## Flujo de la primera pantalla

- La app inicia con pantalla de **login**.
- Envía `username` y `password` a `POST /api/users/authenticate`.
- Guarda el token devuelto en `sessionStorage`.
- Usa ese token en el header `Authorization: Bearer <token>` para consumir endpoints autenticados durante la sesión de la pestaña.

## Ejecución local

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```
