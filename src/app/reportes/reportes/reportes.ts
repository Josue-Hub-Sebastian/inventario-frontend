import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalisisService } from '../../services/analisis.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  @ViewChild('graficaEstado') graficaEstado!: ElementRef;
  @ViewChild('graficaMarca')  graficaMarca!:  ElementRef;
  @ViewChild('graficaTipo')   graficaTipo!:   ElementRef;

  analisis: any = null;
  descargandoPdf  = false;
  descargandoExcel = false;
  chartEstado: Chart | null = null;
  chartMarca:  Chart | null = null;
  chartTipo:   Chart | null = null;

  constructor(private analisisService: AnalisisService) {}

  ngOnInit() {
    this.analisisService.obtenerAnalisis().subscribe({
      next: (data) => {
        this.analisis = data;
        setTimeout(() => this.construirGraficas(), 100);
      }
    });
  }

  construirGraficas() {
    // Gráfica Estado
    this.chartEstado = new Chart(this.graficaEstado.nativeElement, {
  type: 'doughnut',
  data: {
    labels: ['Activos', 'Mantenimiento', 'Baja', 'Prestado'],
    datasets: [{
      data: [
        this.analisis.equiposActivos,
        this.analisis.equiposMantenimiento,
        this.analisis.equiposBaja,
        this.analisis.equiposPrestado
      ],
      backgroundColor: ['#198754', '#ffc107', '#dc3545', '#0dcaf0']
    }]
  },
  options: { plugins: { legend: { position: 'bottom' } } }
});

    // Gráfica Marca
    this.chartMarca = new Chart(this.graficaMarca.nativeElement, {
      type: 'bar',
      data: {
        labels: this.analisis.porMarca.map((x: any) => x.marca),
        datasets: [{
          label: 'Equipos',
          data: this.analisis.porMarca.map((x: any) => x.total),
          backgroundColor: '#0d6efd'
        }]
      },
      options: { plugins: { legend: { display: false } } }
    });

    // Gráfica Tipo
    this.chartTipo = new Chart(this.graficaTipo.nativeElement, {
      type: 'bar',
      data: {
        labels: this.analisis.porTipo.map((x: any) => x.tipo),
        datasets: [{
          label: 'Equipos',
          data: this.analisis.porTipo.map((x: any) => x.total),
          backgroundColor: '#6f42c1'
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } }
      }
    });
  }

  descargarGrafica(chart: Chart, nombre: string) {
    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}.png`;
    a.click();
  }

  descargarPdf() {
    this.descargandoPdf = true;
    this.analisisService.descargarPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventario_equipos.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoPdf = false;
      },
      error: () => { this.descargandoPdf = false; }
    });
  }

  descargarExcel() {
    this.descargandoExcel = true;
    this.analisisService.descargarExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventario_equipos.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoExcel = false;
      },
      error: () => { this.descargandoExcel = false; }
    });
  }
}