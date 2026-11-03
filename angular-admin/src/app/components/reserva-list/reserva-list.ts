import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Reserva } from '../../models/interfaces';
import { ReservaService } from '../../services/reserva.service';
import { LaboratorioService } from '../../services/laboratorio.service';
import { EstadoReservaPipe } from '../../pipes/estado-reserva.pipe';

@Component({
  selector: 'app-reserva-list',
  imports: [NgClass, EstadoReservaPipe],
  template: `
    <h2>Reservas</h2>
    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    <table class="table table-hover align-middle">
      <thead>
        <tr><th>Código</th><th>Laboratorio</th><th>Usuario</th><th>Fecha</th><th>Horario</th><th>Motivo</th><th>Estado</th><th></th></tr>
      </thead>
      <tbody>
        @for (r of reservas(); track r.id) {
          <tr>
            <td>{{ r.codigo }}</td>
            <td>{{ nombreLab(r.laboratorioId) }}</td>
            <td>#{{ r.usuarioId }}</td>
            <td>{{ r.fecha }}</td>
            <td>{{ r.horaInicio }} - {{ r.horaFin }}</td>
            <td>{{ r.motivo }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'text-bg-success': r.estado === 'aprobada',
                'text-bg-warning': r.estado === 'pendiente',
                'text-bg-danger': r.estado === 'rechazada'
              }">{{ r.estado | estadoReserva }}</span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" (click)="cancelar(r)">Cancelar</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="8" class="text-center text-muted">No hay reservas</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class ReservaList implements OnInit {
  private reservaSrv = inject(ReservaService);
  private labSrv = inject(LaboratorioService);

  reservas = signal<Reserva[]>([]);
  nombres = signal<Map<number, string>>(new Map());
  error = signal('');

  ngOnInit() {
    forkJoin({ reservas: this.reservaSrv.listar(), labs: this.labSrv.listar() }).subscribe({
      next: ({ reservas, labs }) => {
        this.nombres.set(new Map(labs.map((l) => [l.id!, l.nombre] as [number, string])));
        this.reservas.set(reservas);
      },
      error: () => this.error.set('No se pudo conectar con el API'),
    });
  }

  nombreLab(id: number) {
    return this.nombres().get(id) ?? `Lab #${id}`;
  }

  cancelar(r: Reserva) {
    if (!confirm(`¿Cancelar la reserva ${r.codigo}?`)) return;
    this.reservaSrv.cancelar(r.id).subscribe({
      next: () => this.reservas.update((lista) => lista.filter((x) => x.id !== r.id)),
      error: () => this.error.set('No se pudo cancelar la reserva'),
    });
  }
}
