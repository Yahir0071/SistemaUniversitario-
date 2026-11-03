import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Laboratorio } from '../../models/interfaces';
import { LaboratorioService } from '../../services/laboratorio.service';

@Component({
  selector: 'app-laboratorio-detail',
  imports: [RouterLink],
  template: `
    @if (lab(); as l) {
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">{{ l.nombre }}</h3>
          <p class="text-muted">{{ l.sede }}</p>
          <p><strong>Capacidad:</strong> {{ l.capacidad }} personas</p>
          <p><strong>Estado:</strong> {{ l.estado }}</p>
          <p><strong>Equipos:</strong></p>
          <ul>
            @for (e of l.equipos; track e) { <li>{{ e }}</li> }
          </ul>
          <a class="btn btn-outline-secondary me-2" routerLink="/laboratorios">← Volver</a>
          <a class="btn btn-primary" [routerLink]="['/laboratorios', l.id, 'editar']">Editar</a>
        </div>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    } @else {
      <p>Cargando...</p>
    }
  `,
})
export class LaboratorioDetail implements OnInit {
  private ruta = inject(ActivatedRoute);
  private servicio = inject(LaboratorioService);
  lab = signal<Laboratorio | null>(null);
  error = signal('');

  ngOnInit() {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    this.servicio.obtener(id).subscribe({
      next: (l) => this.lab.set(l),
      error: () => this.error.set('Laboratorio no encontrado'),
    });
  }
}
