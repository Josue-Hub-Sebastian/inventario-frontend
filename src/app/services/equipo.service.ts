import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Equipo} from '../models/equipo';


@Injectable({
    providedIn: 'root'
})
export class EquipoService {
    private api = 'https://localhost:7192/api/equipo';

    constructor(private http:HttpClient) {}

    listar(): Observable<Equipo[]> {
        return this.http.get<Equipo[]>(this.api);
    }

    importarExcel(file : File): Observable<any> {
        const formData = new FormData();
        formData.append('archivo', file);

        return this.http.post(
            `${this.api}/importar`,
             formData,
            {
                reportProgress: true,
                observe: 'events'
            }
        );
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(
        `${this.api}/${id}`
        );
    }



    buscarPorId(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(
        `${this.api}/${id}`
        );
    }

    actualizar(
        id: number,
        equipo: Equipo
    ): Observable<any> {
        return this.http.put(
        `${this.api}/${id}`,
        equipo
        );
    }


    registrar(
  equipo: Equipo
): Observable<any> {

  return this.http.post(
    this.api,
    equipo
  );
}
}