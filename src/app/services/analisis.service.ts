import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {

  private api =
    'https://localhost:7192/api/Analisis';

  constructor(
    private http: HttpClient
  ) {}

  obtenerAnalisis():
    Observable<any> {

    return this.http.get(this.api);
  }

  descargarPdf():
    Observable<Blob> {

    return this.http.get(
      `${this.api}/exportar-pdf`,
      {
        responseType: 'blob'
      }
    );
  }
  descargarExcel(): Observable<Blob> {
  return this.http.get(
    `${this.api}/exportar-excel`,
    { responseType: 'blob' }
  );
}
}