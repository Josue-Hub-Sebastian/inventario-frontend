import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EquipoService } from './services/equipo.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('inventario-front');
}
