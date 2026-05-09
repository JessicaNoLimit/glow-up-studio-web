/**
 * Configuración centralizada del CRM
 *
 * API_BASE_URL: Base URL para endpoints del backend API
 *
 * ESTE CRM se sirve como archivos estáticos por Express en localhost:4000
 * NO usa Vite para el despliegue, por lo que import.meta.env NO está disponible.
 *
 * La URL del backend está configurada directamente para apuntar al servidor Express.
 */
export const API_BASE_URL = 'http://localhost:4000';
