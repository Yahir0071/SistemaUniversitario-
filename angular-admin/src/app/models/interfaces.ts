export type EstadoLaboratorio = 'disponible' | 'mantenimiento';
export type EstadoReserva = 'pendiente' | 'aprobada' | 'rechazada';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: 'estudiante' | 'admin';
}

export interface Laboratorio {
  id?: number;
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: EstadoLaboratorio;
}

export interface Reserva {
  id: number;
  codigo: string;
  laboratorioId: number;
  usuarioId: number;
  fecha: string;      // AAAA-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string;
  motivo: string;
  estado: EstadoReserva;
  creadoEn: string;
}
