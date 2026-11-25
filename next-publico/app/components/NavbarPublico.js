'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarPublico() {
  const pathname = usePathname();
  const [esOscuro, setEsOscuro] = useState(false);

  const alternarTema = () => {
    const nuevo = !esOscuro;
    setEsOscuro(nuevo);
    document.documentElement.setAttribute('data-bs-theme', nuevo ? 'dark' : 'light');
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
            className="btn btn-sm rounded-pill px-3"
            style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            onClick={alternarTema}
            title="Alternar tema claro/oscuro"
          >
            {esOscuro ? '☀️' : '🌙'}
          </button>
          <Link href="/pedidos/buscar" className="btn btn-sm fc-btn-brand px-3 py-2">
            🔍 Consultar Ticket
          </Link>
        </div>
      </div>
    </header>
  );
}
