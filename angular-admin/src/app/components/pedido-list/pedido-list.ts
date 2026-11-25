import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import { EstadoPedido, Pedido } from '../../models/interfaces';
import { PedidoService } from '../../services/pedido.service';
import { PlatoService } from '../../services/plato.service';
import { EstadoPedidoPipe } from '../../pipes/estado-pedido.pipe';
import { obtenerImagenPlato } from '../../utils/platos-imagenes';

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
  filtro = signal<'todos' | EstadoPedido>('todos');
  error = signal('');
  cargando = signal(false);
  procesando = signal(false);

  pedidosFiltrados = computed(() => {
    const f = this.filtro();
    const lista = this.pedidos();
    return f === 'todos' ? lista : lista.filter((p) => p.estado === f);
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    if (this.cargando() || this.procesando()) return;
    this.error.set('');
    this.cargando.set(true);
    forkJoin({ pedidos: this.pedidoSrv.listar(), platos: this.platoSrv.listar() })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: ({ pedidos, platos }) => {
          this.nombres.set(new Map(platos.map((p) => [p.id!, p.nombre] as [number, string])));
          this.pedidos.set([...pedidos].reverse());
        },
        error: () => this.error.set('No se pudo cargar el panel de pedidos. Comprueba que la API esté en ejecución.'),
      });
  }

  nombrePlato(id: number) {
    return this.nombres().get(id) ?? `Plato #${id}`;
  }

  imagen(id: number) {
    return obtenerImagenPlato(id);
  }

  contar(estado: EstadoPedido) {
    return this.pedidos().filter((p) => p.estado === estado).length;
  }

  cambiarEstado(ped: Pedido, estado: Exclude<EstadoPedido, 'pendiente'>) {
    if (this.cargando() || this.procesando() || ped.estado !== 'pendiente') return;
    this.error.set('');
    this.procesando.set(true);
    this.pedidoSrv.cambiarEstado(ped.id, estado)
      .pipe(finalize(() => this.procesando.set(false)))
      .subscribe({
        next: (actualizado) => this.pedidos.update((lista) =>
          lista.map((pedido) => pedido.id === actualizado.id ? actualizado : pedido)
        ),
        error: () => this.error.set('No se pudo actualizar el pedido. Actualiza la lista e inténtalo de nuevo.'),
      });
  }

  cancelar(ped: Pedido) {
    if (this.cargando() || this.procesando() || ped.estado !== 'pendiente') return;
    if (!confirm(`¿Cancelar la orden ${ped.codigo}?`)) return;
    this.error.set('');
    this.procesando.set(true);
    this.pedidoSrv.cancelar(ped.id)
      .pipe(finalize(() => this.procesando.set(false)))
      .subscribe({
        next: () => this.pedidos.update((lista) => lista.filter((x) => x.id !== ped.id)),
        error: () => this.error.set('No se pudo cancelar el pedido'),
      });
  }
}
