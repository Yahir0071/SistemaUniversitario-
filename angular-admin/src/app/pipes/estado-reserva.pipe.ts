import { Pipe, PipeTransform } from '@angular/core';
import { EstadoReserva } from '../models/interfaces';

const TEXTOS: Record<EstadoReserva, string> = {
  pendiente: '⏳ Pendiente',
  aprobada: '✅ Aprobada',
  rechazada: '❌ Rechazada',
};

@Pipe({ name: 'estadoReserva' })
export class EstadoReservaPipe implements PipeTransform {
  transform(estado: EstadoReserva): string {
    return TEXTOS[estado] ?? estado;
  }
}
