import { Directive, HostBinding, Input } from '@angular/core';

// Uso: <tr [appResaltar]="plato.estado === 'agotado'">
@Directive({ selector: '[appResaltar]' })
export class ResaltarDirective {
  @Input('appResaltar') activo = false;

  @HostBinding('style.backgroundColor') get fondo() {
    return this.activo ? 'rgba(245, 158, 11, 0.16)' : null;
  }
  @HostBinding('style.fontStyle') get estilo() {
    return this.activo ? 'italic' : null;
  }
}
