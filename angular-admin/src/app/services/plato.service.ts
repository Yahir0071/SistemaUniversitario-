import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../models/interfaces';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class PlatoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/platos`;

  listar(categoria?: string, q?: string): Observable<Plato[]> {
    let params = new HttpParams();
    if (categoria) params = params.set('categoria', categoria);
    if (q) params = params.set('q', q);
    return this.http.get<Plato[]>(this.url, { params });
  }

  obtener(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.url}/${id}`);
  }

  crear(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(this.url, plato);
  }

  actualizar(id: number, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.url}/${id}`, plato);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
