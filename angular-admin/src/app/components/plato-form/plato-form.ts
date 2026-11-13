import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlatoService } from '../../services/plato.service';
import { Plato } from '../../models/interfaces';
import { nombrePlatoValidator } from '../../validators/patron.validator';

@Component({
  selector: 'app-plato-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './plato-form.html',
  styleUrl: './plato-form.css',
})
export class PlatoForm implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private servicio = inject(PlatoService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<number | null>(null);
  error = signal('');

  form = this.fb.group({
    nombre: ['', [Validators.required, nombrePlatoValidator]],
    categoria: ['', Validators.required],
    precio: [12.0, [Validators.required, Validators.min(0.5), Validators.max(100)]],
    ingredientes: [''],
    estado: ['disponible' as Plato['estado']],
    imagen: [''],
  });

  ngOnInit() {
    const param = this.ruta.snapshot.paramMap.get('id');
    if (!param) return;
    this.id.set(Number(param));
    this.servicio.obtener(this.id()!).subscribe({
      next: (p) => this.form.patchValue({ ...p, ingredientes: p.ingredientes.join(', '), imagen: p.imagen ?? '' }),
      error: () => this.error.set('No se pudo cargar el plato'),
    });
  }

  invalido(campo: 'nombre' | 'categoria' | 'precio') {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const plato: Plato = {
      ...v,
      precio: Number(v.precio),
      ingredientes: v.ingredientes.split(',').map((i) => i.trim()).filter(Boolean),
    };
    const peticion = this.id() ? this.servicio.actualizar(this.id()!, plato) : this.servicio.crear(plato);
    peticion.subscribe({
      next: () => this.router.navigate(['/platos']),
      error: () => this.error.set('No se pudo guardar el plato'),
    });
  }
}
