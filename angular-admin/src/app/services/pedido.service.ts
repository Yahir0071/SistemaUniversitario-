import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoPedido, Pedido } from '../models/interfaces';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/pedidos`;

  listar(usuarioId?: number): Observable<Pedido[]> {
    let params = new HttpParams();
    if (usuarioId) params = params.set('usuarioId', usuarioId);
    return this.http.get<Pedido[]>(this.url, { params });
  }

  cambiarEstado(id: number, estado: Exclude<EstadoPedido, 'pendiente'>): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.url}/${id}`, { estado });
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
