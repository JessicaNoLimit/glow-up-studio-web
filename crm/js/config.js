/**
 * Configuración centralizada del CRM
 *
 * API_BASE_URL: Base URL para endpoints del backend
 * - En desarrollo: usa variable de entorno VITE_API_BASE_URL
 * - En producción (mismo dominio): string vacío → usa rutas relativas
 *
 * Ejemplos de uso:
 * - Desarrollo: VITE_API_BASE_URL=http://localhost:4000 → http://localhost:4000/admin/login
 * - Producción: (vacío) → /admin/login (mismo dominio)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
