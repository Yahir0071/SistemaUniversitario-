import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LaboratorioService } from '../../services/laboratorio.service';
import { Laboratorio } from '../../models/interfaces';
import { nombreLaboratorioValidator } from '../../validators/patron.validator';

@Component({
  selector: 'app-laboratorio-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2>{{ id() ? 'Editar' : 'Nuevo' }} laboratorio</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" class="col-md-6">
      <div class="mb-3">
        <label class="form-label">Nombre (ej. Lab A-301)</label>
        <input class="form-control" formControlName="nombre" [class.is-invalid]="invalido('nombre')" />
        @if (invalido('nombre')) {
          <div class="invalid-feedback">
            @if (form.controls.nombre.errors?.['required']) { El nombre es obligatorio }
            @else { Formato esperado: "Lab A-301" }
          </div>
        }
      </div>
      <div class="mb-3">
        <label class="form-label">Sede</label>
        <input class="form-control" formControlName="sede" [class.is-invalid]="invalido('sede')" />
        @if (invalido('sede')) { <div class="invalid-feedback">La sede es obligatoria</div> }
      </div>
      <div class="mb-3">
        <label class="form-label">Capacidad (1 a 60)</label>
        <input type="number" class="form-control" formControlName="capacidad" [class.is-invalid]="invalido('capacidad')" />
        @if (invalido('capacidad')) { <div class="invalid-feedback">Ingrese un número entre 1 y 60</div> }
      </div>
      <div class="mb-3">
        <label class="form-label">Equipos (separados por coma)</label>
        <input class="form-control" formControlName="equipos" />
      </div>
      <div class="mb-3">
        <label class="form-label">Estado</label>
        <select class="form-select" formControlName="estado">
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
      <button class="btn btn-primary me-2" type="submit" [disabled]="form.invalid">Guardar</button>
      <a class="btn btn-outline-secondary" routerLink="/laboratorios">Cancelar</a>
    </form>
  `,
})
export class LaboratorioForm implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private servicio = inject(LaboratorioService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<number | null>(null);
  error = signal('');

  form = this.fb.group({
    nombre: ['', [Validators.required, nombreLaboratorioValidator]],
    sede: ['', Validators.required],
    capacidad: [20, [Validators.required, Validators.min(1), Validators.max(60)]],
    equipos: [''],
    estado: ['disponible' as Laboratorio['estado']],
  });

  ngOnInit() {
    const param = this.ruta.snapshot.paramMap.get('id');
    if (!param) return;
    this.id.set(Number(param));
    this.servicio.obtener(this.id()!).subscribe({
      next: (l) => this.form.patchValue({ ...l, equipos: l.equipos.join(', ') }),
      error: () => this.error.set('No se pudo cargar el laboratorio'),
    });
  }

  invalido(campo: 'nombre' | 'sede' | 'capacidad') {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const lab: Laboratorio = {
      ...v,
      equipos: v.equipos.split(',').map((e) => e.trim()).filter(Boolean),
    };
    const peticion = this.id() ? this.servicio.actualizar(this.id()!, lab) : this.servicio.crear(lab);
    peticion.subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => this.error.set('No se pudo guardar'),
    });
  }
}
