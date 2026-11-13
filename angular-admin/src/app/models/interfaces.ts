export type EstadoPlato = 'disponible' | 'agotado';
export type EstadoPedido = 'pendiente' | 'aprobada' | 'rechazada';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: 'estudiante' | 'admin';
}

export interface Plato {
  id?: number;
  nombre: string;
  categoria: string;
  precio: number;
  ingredientes: string[];
  estado: EstadoPlato;
  imagen?: string;
}

export interface Pedido {
  id: number;
  codigo: string;
  platoId: number;
  usuarioId: number;
  fecha: string;      // AAAA-MM-DD
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  notas: string;
  estado: EstadoPedido;
  creadoEn: string;
}
