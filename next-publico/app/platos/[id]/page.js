import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
const API_URL = (process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '');

const IMAGENES = {
  1: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lomo_saltado_peruano.jpg?width=800',
  2: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aj%C3%AD_de_gallina_-_Tradicional.jpg?width=800',
  3: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
  4: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
  5: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
  6: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80',
  7: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80',
  8: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80',
};

const HORARIO_CATEGORIA = {
  Desayunos: '07:30 – 11:30 y 16:00 – 20:00',
  Almuerzos: '12:00 – 15:30',
  Saludable: '12:00 – 20:00',
  Snacks: 'Todo el día (07:30 – 20:00)',
  Bebidas: 'Todo el día (07:30 – 20:00)',
  Postres: 'Todo el día (07:30 – 20:00)',
};

function obtenerImagen(id, urlOpcional) {
  if (urlOpcional && urlOpcional.trim()) return urlOpcional.trim();
  return IMAGENES[Number(id)] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/platos/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Plato no encontrado - FoodCampus' };
    const plato = await res.json();
    return {
      title: `${plato.nombre} - Detalle Público SSR | FoodCampus`,
      description: `Consulta ingredientes, horario de servicio y disponibilidad de ${plato.nombre} en FoodCampus UTP.`,
    };
  } catch {
    return { title: 'Detalle de Plato - FoodCampus' };
  }
}

async function obtenerDetalle(id) {
  try {
    const [resPlato, resPedidos] = await Promise.all([
      fetch(`${API_URL}/platos/${encodeURIComponent(id)}`, { cache: 'no-store' }),
      fetch(`${API_URL}/pedidos?platoId=${encodeURIComponent(id)}`, { cache: 'no-store' }),
    ]);
    if (!resPlato.ok) return null;
    const plato = await resPlato.json();
    const pedidos = resPedidos.ok ? await resPedidos.json() : [];
    const totalPorciones = pedidos
      .filter((p) => p.estado === 'aprobada')
      .reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);
    return { plato, totalPorciones, ordenesActivas: pedidos.filter((p) => p.estado !== 'rechazada').length };
  } catch (error) {
    console.error('Error cargando detalle SSR:', error);
    return null;
  }
}

export default async function DetallePlatoSSR({ params }) {
  const { id } = await params;
  const data = await obtenerDetalle(id);

  if (!data || !data.plato) {
    notFound();
  }

  const { plato, totalPorciones, ordenesActivas } = data;
  const imagenUrl = obtenerImagen(plato.id, plato.imagen);
  const horarioServicio = HORARIO_CATEGORIA[plato.categoria] || '07:30 – 20:00';

  return (
    <div className="container py-4 py-md-5">
      <Link href="/platos" className="btn btn-sm fc-btn-secondary px-3 py-2 mb-4">
        ← Volver al catálogo público
      </Link>

      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <div className="fc-card overflow-hidden">
            <div style={{ height: '360px', overflow: 'hidden' }}>
              <img src={imagenUrl} alt={plato.nombre} className="w-100 h-100 object-fit-cover" />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="fc-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fc-pill-badge">🍽️ {plato.categoria}</span>
              <span className={`fc-badge ${plato.estado === 'disponible' ? 'fc-badge-disponible' : 'fc-badge-agotado'}`}>
                <span className="fc-badge-dot" />
                {plato.estado === 'disponible' ? 'Disponible' : 'Agotado'}
              </span>
            </div>

            <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--ink)' }}>{plato.nombre}</h1>
            <div className="fs-3 fw-bold mb-4 text-brand">S/ {Number(plato.precio).toFixed(2)}</div>

            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <div className="p-3 rounded-4 h-100" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
                  <div className="small text-muted-fc">🕒 Horario de servicio</div>
                  <div className="fw-semibold small mt-1">{horarioServicio}</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 rounded-4 h-100" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
                  <div className="small text-muted-fc">📍 Recojo y preparación</div>
                  <div className="fw-semibold small mt-1">Módulo Central · ~15 min</div>
                </div>
              </div>
            </div>

            <h2 className="small text-uppercase fw-bold text-muted-fc mb-2" style={{ letterSpacing: '0.06em' }}>
              Ingredientes principales
            </h2>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {plato.ingredientes?.map((ing) => (
                <span key={ing} className="fc-pill-badge" style={{ color: 'var(--ink)' }}>
                  ✓ {ing}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
              <div>
                <div className="small text-muted-fc">Popularidad en cafetería</div>
                <div className="fw-semibold small">
                  {totalPorciones > 0 ? `${totalPorciones} porciones preparadas · ${ordenesActivas} órdenes activas` : 'Recién agregado a la carta del día'}
                </div>
              </div>
              <span className="fc-pill-badge">SSR en vivo</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Link href="/pedidos/buscar" className="btn fc-btn-brand flex-fill py-2">
                🔍 Rastrear mi pedido
              </Link>
              <Link href={`/platos?categoria=${encodeURIComponent(plato.categoria)}`} className="btn fc-btn-secondary flex-fill py-2">
                Más en {plato.categoria}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
