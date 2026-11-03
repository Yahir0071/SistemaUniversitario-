import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/interfaces';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private url = `${API_URL}/reservas`;

  listar(usuarioId?: number): Observable<Reserva[]> {
    let params = new HttpParams();
    if (usuarioId) params = params.set('usuarioId', usuarioId);
    return this.http.get<Reserva[]>(this.url, { params });
  }
  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
