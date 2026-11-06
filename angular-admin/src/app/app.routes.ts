import { Routes } from '@angular/router';
import { PlatoList } from './components/plato-list/plato-list';
import { PlatoForm } from './components/plato-form/plato-form';
import { PlatoDetail } from './components/plato-detail/plato-detail';
import { PedidoList } from './components/pedido-list/pedido-list';

export const routes: Routes = [
  { path: '', redirectTo: 'platos', pathMatch: 'full' },
  { path: 'platos', component: PlatoList },
  { path: 'platos/nuevo', component: PlatoForm },
  { path: 'platos/:id/editar', component: PlatoForm },
  { path: 'platos/:id', component: PlatoDetail },
  { path: 'pedidos', component: PedidoList },
  { path: '**', redirectTo: 'platos' },
];
