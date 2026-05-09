# CRM - Configuración de Entorno

## Configuración de la API del Backend

El CRM necesita saber dónde está el backend API para poder hacer las llamadas de autenticación y datos.

### ¿Qué es `VITE_API_BASE_URL`?

Es una variable de entorno que le dice al frontend del CRM dónde se encuentra el backend API.

### Configuración por entorno

#### 1. Desarrollo (localhost)

**Crear archivo `.env.local` en la raíz del proyecto:**

```bash
VITE_API_BASE_URL=http://localhost:4000
```

**IMPORTANTE:** Después de crear o modificar `.env.local`, **debes reiniciar Vite**:

```bash
# Detener Vite (Ctrl+C)
# Y volver a iniciarlo:
npm run dev
```

#### 2. Producción - Mismo dominio

Si el frontend y el backend están en el mismo dominio (ej: ambos en `https://example.com`), **no definir** `VITE_API_BASE_URL`. El CRM usará rutas relativas automáticamente.

#### 3. Producción - Backend externo

Si el backend está en un dominio diferente, definir `VITE_API_BASE_URL` con la URL del backend:

```bash
VITE_API_BASE_URL=https://api.example.com
```

### Estructura de archivos

```
proyecto/
├── .env.local              # Variables de entorno Vite (solo desarrollo)
├── crm/
│   ├── js/
│   │   ├── config.js       # Lee VITE_API_BASE_URL
│   │   ├── api.js          # Usa API_BASE_URL para fetch
│   │   ├── auth.js         # Usa api.js
│   │   └── dashboard.js    # Usa API_BASE_URL para fetch
│   ├── login.html
│   └── dashboard.html
└── backend/               # Corre en http://localhost:4000
```

### Ejemplos de uso

```javascript
import { API_BASE_URL } from './config.js';

// Desarrollo: http://localhost:4000/admin/login
// Producción mismo dominio: /admin/login
// Producción backend externo: https://api.example.com/admin/login
fetch(`${API_BASE_URL}/admin/login`, {
  method: 'POST',
  credentials: 'include'
});
```

### Troubleshooting

#### Error: 404 al hacer login

**Problema:** El CRM intenta llamar a `http://localhost:5173/admin/login` en lugar de `http://localhost:4000/admin/login`.

**Solución:**
1. Verificar que existe el archivo `.env.local` en la raíz del proyecto
2. Verificar que contiene: `VITE_API_BASE_URL=http://localhost:4000`
3. **Reiniciar Vite** (Ctrl+C y `npm run dev`)

#### La variable de entorno no se lee

**Problema:** Cambié `.env.local` pero no funciona.

**Solución:**
- Las variables de entorno de Vite solo se leen al iniciar el servidor
- **Siempre reiniciar Vite** después de cambiar `.env.local`
- Verificar que la variable empieza con `VITE_` (requerido por Vite)

### URLs de desarrollo

- **Frontend (Vite):** http://localhost:5173
- **CRM Login:** http://localhost:4000/crm/login.html
- **CRM Dashboard:** http://localhost:4000/crm/dashboard.html
- **Backend API:** http://localhost:4000/admin/*
