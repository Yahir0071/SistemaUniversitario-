import { Pipe, PipeTransform } from '@angular/core';
import { EstadoPedido } from '../models/interfaces';

const TEXTOS: Record<EstadoPedido, string> = {
  pendiente: '⏳ Pendiente',
  aprobada: '👨‍🍳 En Preparación',
  rechazada: '❌ Cancelado',
};

@Pipe({ name: 'estadoPedido' })
export class EstadoPedidoPipe implements PipeTransform {
  transform(estado: EstadoPedido): string {
    return TEXTOS[estado] ?? estado;
  }
}
