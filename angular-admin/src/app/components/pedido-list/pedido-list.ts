import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Pedido } from '../../models/interfaces';
import { PedidoService } from '../../services/pedido.service';
import { PlatoService } from '../../services/plato.service';
import { EstadoPedidoPipe } from '../../pipes/estado-pedido.pipe';

@Component({
  selector: 'app-pedido-list',
  imports: [NgClass, EstadoPedidoPipe],
  template: `
    <h2>Órdenes y Pedidos del Campus</h2>
    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Código</th>
          <th>Plato solicitado</th>
          <th>Alumno</th>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Notas</th>
          <th>Estado</th>
          <th class="text-end">Acción</th>
        </tr>
      </thead>
      <tbody>
        @for (ped of pedidos(); track ped.id) {
          <tr>
            <td><strong>{{ ped.codigo }}</strong></td>
            <td>{{ nombrePlato(ped.platoId) }}</td>
            <td>#{{ ped.usuarioId }}</td>
            <td>{{ ped.fecha }}</td>
            <td>{{ ped.cantidad }} unid.</td>
            <td><strong>S/ {{ ped.precioTotal.toFixed(2) }}</strong></td>
            <td><small class="text-muted">{{ ped.notas || 'Sin notas' }}</small></td>
            <td>
              <span class="badge" [ngClass]="{
                'text-bg-success': ped.estado === 'aprobada',
                'text-bg-warning': ped.estado === 'pendiente',
                'text-bg-danger': ped.estado === 'rechazada'
              }">{{ ped.estado | estadoPedido }}</span>
            </td>
            <td class="text-end">
              @if (ped.estado === 'pendiente') {
                <button class="btn btn-sm btn-outline-danger" (click)="cancelar(ped)">Cancelar</button>
              }
            </td>
          </tr>
        } @empty {
          <tr><td colspan="9" class="text-center text-muted">No hay pedidos registrados</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class PedidoList implements OnInit {
  private pedidoSrv = inject(PedidoService);
  private platoSrv = inject(PlatoService);

  pedidos = signal<Pedido[]>([]);
  nombres = signal<Map<number, string>>(new Map());
  error = signal('');

  ngOnInit() {
    forkJoin({ pedidos: this.pedidoSrv.listar(), platos: this.platoSrv.listar() }).subscribe({
      next: ({ pedidos, platos }) => {
        this.nombres.set(new Map(platos.map((p) => [p.id!, p.nombre] as [number, string])));
        this.pedidos.set(pedidos);
      },
      error: () => this.error.set('No se pudo conectar con el API de FoodCampus'),
    });
  }

  nombrePlato(id: number) {
    return this.nombres().get(id) ?? `Plato #${id}`;
  }

  cancelar(ped: Pedido) {
    if (!confirm(`¿Cancelar la orden ${ped.codigo}?`)) return;
    this.pedidoSrv.cancelar(ped.id).subscribe({
      next: () => this.pedidos.update((lista) => lista.filter((x) => x.id !== ped.id)),
      error: () => this.error.set('No se pudo cancelar el pedido'),
    });
  }
}
