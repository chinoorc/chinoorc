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

2. Ajustar la URL del backend en `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

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

## Crear/publicar el repositorio nuevo en GitHub

```bash
git init
git add .
git commit -m "Inicializar OrganicoSiOSi Frontend"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/OrganicoSiOSi.Frontend.git
git push -u origin main
```
