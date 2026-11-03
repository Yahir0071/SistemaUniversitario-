import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/laboratorios">🎓 CampusHub Admin</a>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" routerLink="/laboratorios" routerLinkActive="active">Laboratorios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/reservas" routerLinkActive="active">Reservas</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
})
export class Navbar {}
