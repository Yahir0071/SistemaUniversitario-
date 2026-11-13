import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  esOscuro = signal(false);

  ngOnInit() {
    const guardado = localStorage.getItem('foodcampus_admin_theme') === 'dark';
    this.aplicarTema(guardado);
  }

  alternarTema() {
    this.aplicarTema(!this.esOscuro());
  }

  aplicarTema(oscuro: boolean) {
    this.esOscuro.set(oscuro);
    const tema = oscuro ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', tema);
    document.documentElement.classList.toggle('dark', oscuro);
    localStorage.setItem('foodcampus_admin_theme', tema);
  }
}
