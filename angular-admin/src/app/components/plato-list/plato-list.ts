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
  templateUrl: './plato-list.html',
  styleUrl: './plato-list.css',
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
