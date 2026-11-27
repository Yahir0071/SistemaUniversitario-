'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TEMA_KEY = 'foodcampus_tema';

export default function NavbarPublico() {
  const pathname = usePathname();
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(TEMA_KEY) === 'dark';
      setEsOscuro(guardado);
      document.documentElement.setAttribute('data-bs-theme', guardado ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', guardado);
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, []);

  const alternarTema = () => {
    const nuevo = !esOscuro;
    setEsOscuro(nuevo);
    const valor = nuevo ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', valor);
    document.documentElement.classList.toggle('dark', nuevo);
    try {
      localStorage.setItem(TEMA_KEY, valor);
    } catch {
      // Ignorar error de almacenamiento
    }
  };

  return (
    <header className="fc-navbar py-2 px-3">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <span className="fc-squircle">🍴</span>
          <span className="fs-5 fw-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Food<span className="text-brand">Campus</span>
          </span>
        </Link>

        <div className="fc-nav-pill-group">
          <Link href="/" className={`fc-nav-link ${pathname === '/' ? 'active' : ''}`}>
            Inicio
          </Link>
          <Link href="/platos" className={`fc-nav-link ${pathname.startsWith('/platos') ? 'active' : ''}`}>
            Catálogo SSR
          </Link>
          <Link href="/pedidos/buscar" className={`fc-nav-link ${pathname.startsWith('/pedidos') ? 'active' : ''}`}>
            Rastrear Orden
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="fc-theme-switch"
            onClick={alternarTema}
            title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema"
          >
            <span className={`fc-theme-btn ${!esOscuro ? 'active' : ''}`}>☀️</span>
            <span className={`fc-theme-btn ${esOscuro ? 'active' : ''}`}>🌙</span>
          </button>
          <Link href="/pedidos/buscar" className="btn btn-sm fc-btn-brand px-3 py-2">
            🔍 Consultar Ticket
          </Link>
        </div>
      </div>
    </header>
  );
}
