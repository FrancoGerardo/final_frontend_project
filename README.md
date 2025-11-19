# Karaoke Video Processor — Frontend

Este frontend React gestiona la autenticación de usuarios y la carga/procesamiento de videos, protegido mediante autenticación JWT, usando Vite + TypeScript + Tailwind CSS.

## Funcionalidad

- **Login/Registro/JWT:** Pantalla de login y registro de usuario. Login genera y almacena tokens JWT y refresh token localmente. El refresh automático mantiene la sesión activa mientras el refresh token sea válido.
- **Procesamiento de Video Protegido:** Solo usuarios autenticados pueden cargar/procesar videos (ruta `/`). Todas las llamadas protegidas envían un access_token válido.
- **Logout:** Limpia credenciales locales; requiere nueva autenticación.

## Estructura de Carpetas/Componentes

- `src/context/AuthContext.tsx`: Contexto global que gestiona usuario, sesión, login, registro, logout y obtención de usuario actual.
- `src/services/authService.ts`: Servicio de axios con interceptores y reintento automático de refresh token JWT. Exporta `API_BASE_URL`.
- `src/components/`: `LoginForm.tsx`, `RegisterForm.tsx`, `ProtectedRoute.tsx`, y componentes de UI.
- `src/pages/LoginPage.tsx`: Login/registro con redirección si ya autenticado.
- `src/pages/UploadPage.tsx`: Página protegida de carga/procesamiento de video.
- `src/App.tsx`: Routing (`/login` público, `/` protegido).
- `src/main.tsx`: Inicialización, router y contexto.

## Variables de entorno

- `VITE_API_BASE_URL`: URL del backend (por defecto `http://127.0.0.1:8000`).

Ejemplos:

```
# Desarrollo
VITE_API_BASE_URL=http://127.0.0.1:8000

# Producción
VITE_API_BASE_URL=https://api.tu-dominio.com
```

## Descarga del video (karaoke/instrumental)

El backend devuelve un `video/mp4` y expone headers:

- `X-Video-Type`: `karaoke` o `instrumental`. Úsalo para nombrar el archivo como `<original>_karaoke.mp4` o `<original>_instrumental.mp4`.
- `X-Job-ID`: id de la sesión/proceso; guárdalo si necesitas descargas posteriores.
- `Content-Disposition`: si se utiliza, puede traer un nombre de archivo sugerido. El backend expone este header vía CORS.

`UploadPage.tsx` utiliza `API_BASE_URL` y maneja estos headers para descargar el archivo con nombre coherente según el tipo de video.

## Cómo ejecutar

1. Instala dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
2. Define `VITE_API_BASE_URL` si tu backend no usa `http://127.0.0.1:8000`.
3. Inicia en desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```
4. Abre `http://localhost:5173`.

## Requisitos Backend

- Endpoints: `/register`, `/login`, `/refresh`, `/me`, `/procesar-video/` (protegido).
- CORS debe permitir el origen del frontend y exponer headers: `X-Job-ID`, `X-Video-Type`, `X-Archivos-Generados`, `Content-Disposition`.

---

Desarrollado con Vite + React 19 + TypeScript + Tailwind CSS + JWT.
