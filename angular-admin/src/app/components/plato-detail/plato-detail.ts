import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Plato } from '../../models/interfaces';
import { PlatoService } from '../../services/plato.service';

@Component({
  selector: 'app-plato-detail',
  imports: [RouterLink, NgClass],
  templateUrl: './plato-detail.html',
  styleUrl: './plato-detail.css',
})
export class PlatoDetail implements OnInit {
  private ruta = inject(ActivatedRoute);
  private servicio = inject(PlatoService);
  plato = signal<Plato | null>(null);
  error = signal('');

  ngOnInit() {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    this.servicio.obtener(id).subscribe({
      next: (data) => this.plato.set(data),
      error: () => this.error.set('Plato no encontrado en el menú'),
    });
  }
}
