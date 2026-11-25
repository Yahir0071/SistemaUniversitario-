import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export class ErrorHttp extends Error {
  constructor(status) {
    const mensajes = {
      400: 'La API no pudo procesar los datos enviados.',
      401: 'Vuelve a iniciar sesión.',
      403: 'No tienes permiso para realizar esta acción.',
      404: 'El recurso solicitado ya no está disponible.',
      409: 'Hay un conflicto con los datos actuales. Actualiza e inténtalo de nuevo.',
    };
    super(mensajes[status] ?? `La API respondió con un error (${status}).`);
    this.status = status;
  }
}

export async function leerRespuesta(response) {
  if (!response.ok) throw new ErrorHttp(response.status);
  return response.json();
}

export async function consultar(ruta, signal) {
  const response = await fetch(`${API_URL}${ruta}`, { signal, cache: 'no-store' });
  return leerRespuesta(response);
}

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response
    ? new ErrorHttp(error.response.status)
    : new Error('No se pudo conectar con el API de FoodCampus.'))
);
