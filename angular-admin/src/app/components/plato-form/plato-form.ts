import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlatoService } from '../../services/plato.service';
import { Plato } from '../../models/interfaces';
import { nombrePlatoValidator } from '../../validators/patron.validator';

@Component({
  selector: 'app-plato-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2>{{ id() ? 'Editar' : 'Nuevo' }} plato</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" class="col-md-6">
      <div class="mb-3">
        <label class="form-label">Nombre del plato (ej. Lomo Saltado Criollo)</label>
        <input class="form-control" formControlName="nombre" [class.is-invalid]="invalido('nombre')" />
        @if (invalido('nombre')) {
          <div class="invalid-feedback">
            @if (form.controls.nombre.errors?.['required']) { El nombre es obligatorio }
            @else { Formato inválido: debe iniciar con mayúscula y tener mínimo 3 caracteres }
          </div>
        }
      </div>

      <div class="mb-3">
        <label class="form-label">Categoría</label>
        <select class="form-select" formControlName="categoria" [class.is-invalid]="invalido('categoria')">
          <option value="">Seleccione una categoría</option>
          <option value="Almuerzos">Almuerzos</option>
          <option value="Desayunos">Desayunos</option>
          <option value="Snacks">Snacks</option>
          <option value="Saludable">Saludable</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Postres">Postres</option>
        </select>
        @if (invalido('categoria')) { <div class="invalid-feedback">La categoría es obligatoria</div> }
      </div>

      <div class="mb-3">
        <label class="form-label">Precio en S/. (0.50 a 100.00)</label>
        <input type="number" step="0.50" class="form-control" formControlName="precio" [class.is-invalid]="invalido('precio')" />
        @if (invalido('precio')) { <div class="invalid-feedback">Ingrese un precio válido entre S/ 0.50 y S/ 100.00</div> }
      </div>

      <div class="mb-3">
        <label class="form-label">Ingredientes (separados por coma)</label>
        <input class="form-control" formControlName="ingredientes" placeholder="Ej. Arroz, Carne, Papas fritas" />
      </div>

      <div class="mb-3">
        <label class="form-label">Estado</label>
        <select class="form-select" formControlName="estado">
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
        </select>
      </div>

      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }

      <button class="btn btn-primary me-2" type="submit" [disabled]="form.invalid">Guardar</button>
      <a class="btn btn-outline-secondary" routerLink="/platos">Cancelar</a>
    </form>
  `,
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
  });

  ngOnInit() {
    const param = this.ruta.snapshot.paramMap.get('id');
    if (!param) return;
    this.id.set(Number(param));
    this.servicio.obtener(this.id()!).subscribe({
      next: (p) => this.form.patchValue({ ...p, ingredientes: p.ingredientes.join(', ') }),
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
