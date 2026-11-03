import { Directive, HostBinding, Input } from '@angular/core';

// Uso: <tr [appResaltar]="lab.estado === 'mantenimiento'">
@Directive({ selector: '[appResaltar]' })
export class ResaltarDirective {
  @Input('appResaltar') activo = false;

  @HostBinding('style.backgroundColor') get fondo() {
    return this.activo ? '#fff3cd' : null;
  }
  @HostBinding('style.fontStyle') get estilo() {
    return this.activo ? 'italic' : null;
  }
}
