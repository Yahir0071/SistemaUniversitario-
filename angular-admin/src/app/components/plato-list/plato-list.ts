import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Plato } from '../../models/interfaces';
import { PlatoService } from '../../services/plato.service';
import { ResaltarDirective } from '../../directives/resaltar.directive';

@Component({
  selector: 'app-plato-list',
  imports: [RouterLink, FormsModule, NgClass, ResaltarDirective],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Menú de Platos</h2>
      <a class="btn btn-primary" routerLink="/platos/nuevo">+ Nuevo plato</a>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4">
        <input class="form-control" placeholder="Buscar plato por nombre..." [(ngModel)]="q" (ngModelChange)="cargar()" />
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="categoria" (ngModelChange)="cargar()">
          <option value="">Todas las categorías</option>
          @for (c of categorias(); track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>
    </div>

    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <table class="table table-hover align-middle">
      <thead>
        <tr><th>Plato</th><th>Categoría</th><th>Precio</th><th>Ingredientes</th><th>Estado</th><th class="text-end">Acciones</th></tr>
      </thead>
      <tbody>
        @for (plato of platos(); track plato.id) {
          <tr [appResaltar]="plato.estado === 'agotado'">
            <td><a [routerLink]="['/platos', plato.id]">{{ plato.nombre }}</a></td>
            <td><span class="badge bg-secondary">{{ plato.categoria }}</span></td>
            <td><strong>S/ {{ plato.precio.toFixed(2) }}</strong></td>
            <td>{{ plato.ingredientes.join(', ') }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'text-bg-success': plato.estado === 'disponible',
                'text-bg-warning': plato.estado === 'agotado'
              }">{{ plato.estado }}</span>
            </td>
            <td class="text-end">
              <a class="btn btn-sm btn-outline-secondary me-1" [routerLink]="['/platos', plato.id, 'editar']">Editar</a>
              <button class="btn btn-sm btn-outline-danger" (click)="eliminar(plato)">Eliminar</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="6" class="text-center text-muted">No hay platos disponibles en esta búsqueda</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class PlatoList implements OnInit {
  private servicio = inject(PlatoService);

  platos = signal<Plato[]>([]);
  categorias = signal<string[]>([]);
  error = signal('');
  q = '';
  categoria = '';

  ngOnInit() {
    // Categorías únicas calculadas con Set
    this.servicio.listar().subscribe({
      next: (todos) => this.categorias.set([...new Set(todos.map((p) => p.categoria))]),
      error: () => this.error.set('No se pudo conectar con el API de FoodCampus (¿corre npm run api?)'),
    });
    this.cargar();
  }

  cargar() {
    this.servicio.listar(this.categoria, this.q).subscribe({
      next: (data) => { this.platos.set(data); this.error.set(''); },
      error: () => this.error.set('No se pudo conectar con el API de FoodCampus (¿corre npm run api?)'),
    });
  }

  eliminar(plato: Plato) {
    if (!confirm(`¿Eliminar ${plato.nombre} del menú?`)) return;
    this.servicio.eliminar(plato.id!).subscribe({
      next: () => this.platos.update((lista) => lista.filter((p) => p.id !== plato.id)),
      error: () => this.error.set('No se pudo eliminar el plato'),
    });
  }
}
