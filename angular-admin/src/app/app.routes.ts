import { Routes } from '@angular/router';
import { LaboratorioList } from './components/laboratorio-list/laboratorio-list';
import { LaboratorioForm } from './components/laboratorio-form/laboratorio-form';
import { LaboratorioDetail } from './components/laboratorio-detail/laboratorio-detail';
import { ReservaList } from './components/reserva-list/reserva-list';

export const routes: Routes = [
  { path: '', redirectTo: 'laboratorios', pathMatch: 'full' },
  { path: 'laboratorios', component: LaboratorioList },
  { path: 'laboratorios/nuevo', component: LaboratorioForm },       // antes de :id
  { path: 'laboratorios/:id/editar', component: LaboratorioForm },
  { path: 'laboratorios/:id', component: LaboratorioDetail },
  { path: 'reservas', component: ReservaList },
  { path: '**', redirectTo: 'laboratorios' },
];
