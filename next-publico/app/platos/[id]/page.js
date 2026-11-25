import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

function obtenerImagen(id, urlOpcional) {
  if (urlOpcional && urlOpcional.trim()) return urlOpcional.trim();
  return IMAGENES[Number(id)] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`http://localhost:3000/platos/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Plato no encontrado - FoodCampus' };
    const plato = await res.json();
    return {
      title: `${plato.nombre} - Detalle Público SSR | FoodCampus`,
      description: `Consulta los ingredientes y pedidos aprobados de ${plato.nombre} en FoodCampus UTP.`,
    };
  } catch {
    return { title: 'Detalle de Plato - FoodCampus' };
  }
}

async function obtenerDetalle(id) {
  try {
    const [resPlato, resPedidos] = await Promise.all([
      fetch(`http://localhost:3000/platos/${id}`, { cache: 'no-store' }),
      fetch(`http://localhost:3000/pedidos?platoId=${id}`, { cache: 'no-store' }),
    ]);

    if (!resPlato.ok) return null;

    const plato = await resPlato.json();
    const pedidos = resPedidos.ok ? await resPedidos.json() : [];
    const pedidosAprobados = pedidos.filter((p) => p.estado === 'aprobada');

    return { plato, pedidosAprobados };
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

  const { plato, pedidosAprobados } = data;
  const imagenUrl = obtenerImagen(plato.id, plato.imagen);

  return (
    <div className="container py-5">
      <Link href="/platos" className="fc-btn-secondary btn-sm mb-4">
        ← Volver al catálogo público
      </Link>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="fc-card overflow-hidden h-100">
            <div style={{ height: '280px', overflow: 'hidden' }}>
              <img src={imagenUrl} alt={plato.nombre} className="w-100 h-100 object-fit-cover" />
            </div>

            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fc-pill-badge">{plato.categoria}</span>
                <span
                  className="badge px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: plato.estado === 'disponible' ? 'var(--moss)' : 'var(--ember)',
                    fontSize: '0.75rem',
                  }}
                >
                  ● {plato.estado}
                </span>
              </div>

              <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--ink)' }}>{plato.nombre}</h1>
              <div className="fs-3 fw-bold mb-4" style={{ color: 'var(--brand)' }}>
                S/ {Number(plato.precio).toFixed(2)}
              </div>

              <h5 className="small text-uppercase fw-bold mb-2" style={{ color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>
                Ingredientes y Guarniciones:
              </h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {plato.ingredientes?.map((ing) => (
                  <span key={ing} className="fc-pill-badge" style={{ backgroundColor: 'var(--surface-sunken)', color: 'var(--ink)' }}>
                    ✓ {ing}
                  </span>
                ))}
              </div>

              <div className="p-3 rounded-4" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
                <span className="small d-block" style={{ color: 'var(--ink-muted)' }}>Identificador en base de datos:</span>
                <code style={{ color: 'var(--brand)' }}>platoId: #{plato.id}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="fc-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--ink)' }}>Órdenes Aprobadas de la Semana</h3>
              <span className="fc-pill-badge">{pedidosAprobados.length} pedidos</span>
            </div>
            
            <p className="small mb-4" style={{ color: 'var(--ink-muted)' }}>
              Relación de pedidos confirmados por el personal de cafetería (Renderizado SSR).
            </p>

            {pedidosAprobados.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {pedidosAprobados.map((ped) => (
                  <div
                    key={ped.id}
                    className="p-3 rounded-4 d-flex justify-content-between align-items-center"
                    style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}
                  >
                    <div>
                      <Link href={`/pedidos/${ped.codigo}`} className="fw-bold text-decoration-none fs-6" style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>
                        {ped.codigo}
                      </Link>
                      <div className="small" style={{ color: 'var(--ink-muted)' }}>
                        Fecha: <strong style={{ color: 'var(--ink)' }}>{ped.fecha}</strong> · {ped.cantidad} unid.
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold d-block" style={{ color: 'var(--moss)' }}>
                        S/ {Number(ped.precioTotal).toFixed(2)}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'var(--moss-soft)', color: 'var(--moss)' }}>
                        aprobada
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 rounded-4" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', color: 'var(--ink-muted)' }}>
                No hay órdenes aprobadas para este plato en los registros actuales.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
