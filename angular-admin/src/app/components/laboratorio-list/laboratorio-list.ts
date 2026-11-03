import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Laboratorio } from '../../models/interfaces';
import { LaboratorioService } from '../../services/laboratorio.service';
import { ResaltarDirective } from '../../directives/resaltar.directive';

@Component({
  selector: 'app-laboratorio-list',
  imports: [RouterLink, FormsModule, NgClass, ResaltarDirective],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Laboratorios</h2>
      <a class="btn btn-primary" routerLink="/laboratorios/nuevo">+ Nuevo laboratorio</a>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4">
        <input class="form-control" placeholder="Buscar por nombre..." [(ngModel)]="q" (ngModelChange)="cargar()" />
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="sede" (ngModelChange)="cargar()">
          <option value="">Todas las sedes</option>
          @for (s of sedes(); track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
      </div>
    </div>

    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <table class="table table-hover align-middle">
      <thead>
        <tr><th>Nombre</th><th>Sede</th><th>Capacidad</th><th>Equipos</th><th>Estado</th><th class="text-end">Acciones</th></tr>
      </thead>
      <tbody>
        @for (lab of laboratorios(); track lab.id) {
          <tr [appResaltar]="lab.estado === 'mantenimiento'">
            <td><a [routerLink]="['/laboratorios', lab.id]">{{ lab.nombre }}</a></td>
            <td>{{ lab.sede }}</td>
            <td>{{ lab.capacidad }}</td>
            <td>{{ lab.equipos.join(', ') }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'text-bg-success': lab.estado === 'disponible',
                'text-bg-warning': lab.estado === 'mantenimiento'
              }">{{ lab.estado }}</span>
            </td>
            <td class="text-end">
              <a class="btn btn-sm btn-outline-secondary me-1" [routerLink]="['/laboratorios', lab.id, 'editar']">Editar</a>
              <button class="btn btn-sm btn-outline-danger" (click)="eliminar(lab)">Eliminar</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="6" class="text-center text-muted">No hay laboratorios para mostrar</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class LaboratorioList implements OnInit {
  private servicio = inject(LaboratorioService);

  laboratorios = signal<Laboratorio[]>([]);
  sedes = signal<string[]>([]);
  error = signal('');
  q = '';
  sede = '';

  ngOnInit() {
    // Las sedes se calculan una sola vez con la lista completa (Set elimina duplicados)
    this.servicio.listar().subscribe({
      next: (todos) => this.sedes.set([...new Set(todos.map((l) => l.sede))]),
      error: () => this.error.set('No se pudo conectar con el API (¿corre npm run api?)'),
    });
    this.cargar();
  }

  cargar() {
    this.servicio.listar(this.sede, this.q).subscribe({
      next: (data) => { this.laboratorios.set(data); this.error.set(''); },
      error: () => this.error.set('No se pudo conectar con el API (¿corre npm run api?)'),
    });
  }

  eliminar(lab: Laboratorio) {
    if (!confirm(`¿Eliminar ${lab.nombre}?`)) return;
    this.servicio.eliminar(lab.id!).subscribe({
      next: () => this.laboratorios.update((lista) => lista.filter((l) => l.id !== lab.id)), // sin recargar
      error: () => this.error.set('No se pudo eliminar'),
    });
  }
}
