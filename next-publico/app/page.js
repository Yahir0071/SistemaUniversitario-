import Link from 'next/link';
import { categoriasUnicas } from '../src/core/estadisticas.js';

export const dynamic = 'force-dynamic';
const API_URL = (process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata = {
  title: 'Inicio - FoodCampus Público SSR',
  description: 'Portal público renderizado en el servidor para estudiantes y visitantes de la cafetería FoodCampus.',
};

const ICONOS_CAT = { Almuerzos: '🍽️', Desayunos: '☕', Snacks: '🍔', Saludable: '🥗', Bebidas: '🥤', Postres: '🍰' };

async function obtenerPlatos() {
  try {
    const res = await fetch(`${API_URL}/platos`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const platos = await obtenerPlatos();
  const disponibles = platos.filter((p) => p.estado === 'disponible').length;
  const categorias = categoriasUnicas(platos);

  return (
    <div className="container py-4">
      {/* Hero fotográfico idéntico a React */}
      <section className="fc-hero p-4 p-md-5 mb-4 d-flex align-items-center text-white">
        <div className="col-lg-7">
          <span className="fc-hero-badge mb-3">
            Cafetería Universitaria UTP · {disponibles} platos disponibles (SSR)
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
            Consulta el menú público sin iniciar sesión.
          </h1>
          <p className="mb-4 fs-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Revisa la carta diaria renderizada en el servidor y verifica el estado de cualquier pedido ingresando su código oficial.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn fc-btn-brand px-4 py-2" href="/platos">
              Ver catálogo SSR
            </Link>
            <Link
              className="btn px-4 py-2 text-white fw-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '14px' }}
              href="/pedidos/buscar"
            >
              Rastrear pedido
            </Link>
          </div>
        </div>
      </section>

      {/* 3 tarjetas de métricas estilo React */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">⚡ Renderizado</span>
            <p className="fs-4 fw-bold mb-0 mt-1">100% Servidor (SSR)</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">📍 Punto de entrega</span>
            <p className="fs-4 fw-bold mb-0 mt-1 text-brand">Módulo Central</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">🍽️ Carta disponible hoy</span>
            <p className="fs-4 fw-bold mb-0 mt-1" style={{ color: 'var(--moss)' }}>{disponibles} platos hoy</p>
          </div>
        </div>
      </div>

      {/* Categorías estilo React */}
      {categorias.length > 0 && (
        <>
          <h3 className="h5 fw-bold mb-3">Categorías del menú</h3>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 mb-4">
            {categorias.map((cat) => (
              <div className="col" key={cat}>
                <Link href={`/platos?categoria=${encodeURIComponent(cat)}`} className="fc-card fc-card-hover p-3 text-center d-block text-decoration-none" style={{ color: 'var(--ink)' }}>
                  <div className="fs-3 mb-1">{ICONOS_CAT[cat] ?? '🍴'}</div>
                  <div className="fw-semibold small">{cat}</div>
                  <div className="text-muted-fc" style={{ fontSize: '0.75rem' }}>
                    {platos.filter((p) => p.categoria === cat).length} platos
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
