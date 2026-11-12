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
  templateUrl: './pedido-list.html',
  styleUrl: './pedido-list.css',
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
