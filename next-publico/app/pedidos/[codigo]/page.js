import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { codigo } = await params;
  const codigoLimpio = decodeURIComponent(codigo).toUpperCase();
  return {
    title: `Pedido ${codigoLimpio} - Consulta Pública SSR | FoodCampus`,
    description: `Seguimiento en tiempo real del estado de atención del pedido ${codigoLimpio} en FoodCampus.`,
  };
}

async function obtenerPedidoPorCodigo(codigo) {
  try {
    const res = await fetch(`http://localhost:3000/pedidos?codigo=${encodeURIComponent(codigo)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const pedidos = await res.json();
    if (!pedidos || pedidos.length === 0) return null;

    const pedido = pedidos[0];
    let plato = null;
    if (pedido.platoId) {
      const resPlato = await fetch(`http://localhost:3000/platos/${pedido.platoId}`, { cache: 'no-store' });
      if (resPlato.ok) plato = await resPlato.json();
    }

    return { pedido, plato };
  } catch (error) {
    console.error('Error cargando pedido SSR:', error);
    return null;
  }
}

export default async function DetallePedidoPorCodigo({ params }) {
  const { codigo } = await params;
  const codigoLimpio = decodeURIComponent(codigo).toUpperCase();
  const data = await obtenerPedidoPorCodigo(codigoLimpio);

  // Página de "no encontrada" si el código no existe
  if (!data || !data.pedido) {
    return (
      <div className="container py-5 text-center">
        <div className="fc-card p-5 mx-auto" style={{ maxWidth: '580px' }}>
          <span className="fs-1 mb-3 d-block">🔍❌</span>
          <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--ember)' }}>Pedido No Encontrado</h1>
          <p className="mb-4" style={{ color: 'var(--ink-muted)' }}>
            No se encontró ningún registro para el código <code className="fs-5 fw-bold" style={{ color: 'var(--brand)' }}>{codigoLimpio}</code> en la base de datos de la cafetería.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/pedidos/buscar" className="fc-btn-primary">
              Buscar otro código
            </Link>
            <Link href="/platos" className="fc-btn-secondary">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { pedido, plato } = data;

  const colorBadge = {
    aprobada: { bg: 'var(--moss-soft)', color: 'var(--moss)' },
    pendiente: { bg: 'var(--ochre-soft)', color: 'var(--ochre)' },
    rechazada: { bg: 'var(--ember-soft)', color: 'var(--ember)' },
  }[pedido.estado] || { bg: 'var(--surface-sunken)', color: 'var(--ink-muted)' };

  return (
    <div className="container py-5">
      <div className="fc-card p-5 mx-auto" style={{ maxWidth: '640px', background: 'radial-gradient(ellipse at 50% 0%, var(--surface-raised) 0%, var(--surface) 100%)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--line) !important;' }}>
          <div>
            <span className="small text-uppercase fw-bold d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Consulta Pública (SSR)
            </span>
            <h1 className="h3 fw-bold mb-0" style={{ color: 'var(--ink)' }}>Estado de tu Pedido</h1>
          </div>
          <span
            className="badge text-uppercase px-3 py-2 rounded-pill"
            style={{
              backgroundColor: colorBadge.bg,
              color: colorBadge.color,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            ● {pedido.estado}
          </span>
        </div>

        <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
          <div className="row g-4">
            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Código Oficial:</span>
              <strong className="fs-4" style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>{pedido.codigo}</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Fecha de Recojo:</span>
              <strong style={{ color: 'var(--ink)' }}>{pedido.fecha}</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Plato Solicitado:</span>
              <strong style={{ color: 'var(--ink)' }}>{plato ? plato.nombre : `Plato #${pedido.platoId}`}</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Cantidad:</span>
              <strong style={{ color: 'var(--ink)' }}>{pedido.cantidad} unidad(es)</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Indicaciones:</span>
              <span className="small" style={{ color: 'var(--ink-muted)' }}>{pedido.notas || 'Sin notas adicionales'}</span>
            </div>

            <div className="col-sm-6">
              <span className="small d-block" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>Total a Pagar:</span>
              <strong className="fs-4" style={{ color: 'var(--moss)' }}>S/ {Number(pedido.precioTotal).toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <Link href="/pedidos/buscar" className="fc-btn-secondary">
            ← Rastrear otro código
          </Link>
          <Link href="/platos" className="fc-btn-primary">
            Ver Catálogo de Platos
          </Link>
        </div>
      </div>
    </div>
  );
}
