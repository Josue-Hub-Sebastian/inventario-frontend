import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  HttpEventType
} from '@angular/common/http';

declare var bootstrap: any;
import { Equipo } from '../../models/equipo';
import { EquipoService } from '../../services/equipo.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class InventarioComponent implements OnInit {

  equipoEditar: Equipo = {
  codigoPatrimonial: '',
  tipoEquipo: '',
  marca: '',
  modelo: '',
  numeroSerie: '',
  estadoEquipo: '',
  ubicacion: '',
  usuarioAsignado: ''
};

// crear variable para controlar modo edición
  modoEdicion: boolean = false;
  //para la barra de progreso
  progreso: number = 0;
  // lista de equipos obtenida del backend
  listaEquipos: Equipo[] = [];
  //selected file para importar Excel
  archivoSeleccionado!: File;
  // indicador de carga para importación
  cargando: boolean = false;

  constructor(private equipoService: EquipoService) {}

  ngOnInit(): void {
    this.listar();
  }

  // método para listar equipos al cargar la página
  listar(): void {
    this.equipoService.listar().subscribe({
      next: (data) => {
        this.listaEquipos = data;
      },
      error: (err) =>
        this.manejarError(err, 'Error al listar equipos')
    });
  }

  // método para manejar selección de archivo
  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0];
  }

  // método para importar Excel
  importarExcel(): void {

    if (!this.archivoSeleccionado) {
      alert('Por favor, seleccione un archivo Excel');
      return;
    }

    this.cargando = true;
    this.progreso = 0;
    this.equipoService
      .importarExcel(this.archivoSeleccionado)
      .subscribe({
        next: (event: any) => {

          // progreso
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round(
              (100 * event.loaded) / event.total
            );
          }

          // respuesta final
          if (event.type === HttpEventType.Response) {
            console.log(
              'Archivo importado exitosamente',
              event.body
            );
            alert('Excel importado correctamente');
            // refrescar tabla automáticamente
            this.listar();
            this.cargando = false;
            this.progreso = 100;
          }
        },

        error: (err) => {
          this.manejarError(err, 'Error al importar Excel');
          this.cargando = false;
        }
      });
  }

  // método para eliminar equipo
  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este equipo?')) {
      return;
    }

    this.equipoService.eliminar(id)
      .subscribe({
        next: () => {
          alert('Equipo eliminado');
          this.listar();
        },

        error: (err) => {
          this.manejarError(err, 'Error al eliminar');
        }
      });
  }

  // metodo para el manejo de errores de las peticiones HTTP
  private manejarError(err: any, contexto: string): void {

    console.error(contexto, err);

    let mensajeUsuario = `${contexto}\n`;
    if (err.status === 0) {
      mensajeUsuario +=
        'No se pudo conectar con el servidor.';
    }
    else if (err.status >= 400 && err.status < 500) {
      mensajeUsuario +=
        `Error cliente (${err.status})`;
    }
    else if (err.status >= 500) {
      mensajeUsuario +=
        `Error servidor (${err.status})`;
    }
    else {
      mensajeUsuario += err.message;
    }

    alert(mensajeUsuario);
  }

  // métodos para abrir modal de edición y registrar nuevo equipo
  abrirModalEditar(equipo: Equipo): void {
    this.modoEdicion = true;

  this.equipoEditar = { ...equipo };

  const modalElement =
    document.getElementById('modalEditar');

  const modal =
    new bootstrap.Modal(modalElement);

  modal.show();
}

// método para actualizar equipo
actualizarEquipo(): void {

  if (!this.equipoEditar.id) {
    return;
  }

  this.equipoService.actualizar(
    this.equipoEditar.id,
    this.equipoEditar
  ).subscribe({

    next: () => {
      alert('Equipo actualizado');
      this.listar();

      const modal =
        document.getElementById('modalEditar');

      const modalBootstrap =
        (window as any)
        .bootstrap
        .Modal
        .getInstance(modal);
      modalBootstrap.hide();
    },

    error: (err) => {
      this.manejarError(
        err,
        'Error al actualizar'
      );
    }
  });
}

// método para abrir modal de registro
  abrirModalRegistrar(): void {

  this.modoEdicion = false;
  this.equipoEditar = {

    codigoPatrimonial: '',
    tipoEquipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    estadoEquipo: 'Activo',
    ubicacion: '',
    usuarioAsignado: ''
  };

  const modalElement =
    document.getElementById('modalEditar');

  const modal =
    new bootstrap.Modal(modalElement);

  modal.show();
}

// método para registrar nuevo equipo
  registrarEquipo(): void {
  this.equipoService
    .registrar(this.equipoEditar)
    .subscribe({
      next: () => {

        alert('Equipo registrado');
        this.listar();

        const modal =
          document.getElementById(
            'modalEditar'
          );

        const modalBootstrap =
          bootstrap.Modal.getInstance(modal);
        modalBootstrap.hide();
      },

      error: (err) => {
        this.manejarError(
          err,
          'Error al registrar'
        );
      }
    });
}
}