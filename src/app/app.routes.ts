import { Routes } from '@angular/router';
import { InventarioComponent } from './pages/inventario/inventario';
import { Dashboard } from './layout/dashboard/dashboard';
import { LoginComponent } from './auth/login/login';
import { Reportes } from './reportes/reportes/reportes';
import { Usuarios } from './usuarios/usuarios/usuarios';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardHome
      },
      {
        path: 'inventario',
        component: InventarioComponent
      },
      {
        path: 'reportes',
        component: Reportes
      },
      {
        path: 'usuarios',
        component: Usuarios
      }
    ]
  }
];
