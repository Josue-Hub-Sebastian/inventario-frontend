import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalisisService } from '../../services/analisis.service';
import { EquipoService } from '../../services/equipo.service';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {

  analisis: any = null;
  cargando = true;

  // Busqueda
  textoBusqueda = '';
  estadoFiltro = '';
  ubicacionFiltro = '';
  resultados: Equipo[] = [];
  buscando = false;
  buscado = false;

  constructor(
    private analisisService: AnalisisService,
    private equipoService: EquipoService
  ) {}

  ngOnInit() {
    this.analisisService.obtenerAnalisis().subscribe({
      next: (data) => {
        this.analisis = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  buscar() {
    this.buscando = true;
    this.buscado = false;
    this.equipoService.buscar(
      this.textoBusqueda,
      this.estadoFiltro,
      this.ubicacionFiltro
    ).subscribe({
      next: (data) => {
        this.resultados = data;
        this.buscando = false;
        this.buscado = true;
      },
      error: () => { this.buscando = false; }
    });
  }

  limpiar() {
    this.textoBusqueda = '';
    this.estadoFiltro = '';
    this.ubicacionFiltro = '';
    this.resultados = [];
    this.buscado = false;
  }
}