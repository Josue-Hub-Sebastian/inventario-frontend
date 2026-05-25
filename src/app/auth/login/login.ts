import { Component, OnInit } from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { Router }
from '@angular/router';

import { AuthService }
from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  username: string = '';

  password: string = '';

  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.estaLogueado()) {
      this.router.navigate(['/dashboard']);
    }
  }

  iniciarSesion(): void {

    if(
      !this.username ||
      !this.password
    ){
      alert('Complete los campos');
      return;
    }

    this.cargando = true;

    this.authService.login({

      username: this.username,

      password: this.password

    }).subscribe({

      next: (response) => {

        this.authService
          .guardarSesion(response);

        this.router.navigate([
          '/dashboard'
        ]);

      },

      error: () => {

        alert(
          'Credenciales incorrectas'
        );

        this.cargando = false;
      }
    });
  }
}