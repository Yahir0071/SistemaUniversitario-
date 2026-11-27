import Link from 'next/link';
import { esCodigoPedido } from '../../../src/core/validadores.js';

export const dynamic = 'force-dynamic';
const API_URL = (process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function generateMetadata({ params }) {
  const { codigo } = await params;
  const codigoLimpio = decodeURIComponent(codigo).toUpperCase();
  return {
    title: `Pedido ${codigoLimpio} - Consulta Pública SSR | FoodCampus`,
    description: `Seguimiento en tiempo real del estado de atención del pedido ${codigoLimpio} en FoodCampus.`,
  };
}

async function obtenerPedidoPorCodigo(codigo) {
  if (!esCodigoPedido(codigo)) return { formatoInvalido: true };
  try {
    const res = await fetch(`${API_URL}/pedidos?codigo=${encodeURIComponent(codigo)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const pedidos = await res.json();
    if (!pedidos || pedidos.length === 0) return null;

    const pedido = pedidos[0];
    let plato = null;
    if (pedido.platoId) {
      const resPlato = await fetch(`${API_URL}/platos/${encodeURIComponent(pedido.platoId)}`, { cache: 'no-store' });
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

  if (!data || data.formatoInvalido || !data.pedido) {
    return (
      <div className="container py-5 text-center">
        <div className="fc-card p-5 mx-auto" style={{ maxWidth: '580px' }}>
          <span className="fs-1 mb-3 d-block">🔍</span>
          <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--ember)' }}>
            {data?.formatoInvalido ? 'Formato de código inválido' : 'Pedido no encontrado'}
          </h1>
          <p className="mb-4 text-muted-fc">
            {data?.formatoInvalido
              ? <>El código <code className="fw-bold text-brand">{codigoLimpio}</code> no cumple el formato oficial <code>PED-0001</code>.</>
              : <>No se encontró ningún registro para <code className="fs-5 fw-bold text-brand">{codigoLimpio}</code> en la cafetería.</>}
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/pedidos/buscar" className="btn fc-btn-brand px-4 py-2">
              Buscar otro código
            </Link>
            <Link href="/platos" className="btn fc-btn-secondary px-4 py-2">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { pedido, plato } = data;
  const horaRecojo = pedido.hora || (pedido.creadoEn?.length >= 16 ? pedido.creadoEn.slice(11, 16) : '');
  const etiquetaEstado = {
    aprobada: 'En preparación',
    pendiente: 'Pendiente',
    rechazada: 'Rechazada',
  }[pedido.estado] || pedido.estado;

  const colorBadge = {
    aprobada: { bg: 'var(--moss-soft)', color: 'var(--moss)' },
    pendiente: { bg: 'var(--ochre-soft)', color: 'var(--ochre)' },
    rechazada: { bg: 'var(--ember-soft)', color: 'var(--ember)' },
  }[pedido.estado] || { bg: 'var(--surface-sunken)', color: 'var(--ink-muted)' };

  return (
    <div className="container py-5">
      <div className="fc-card p-4 p-md-5 mx-auto" style={{ maxWidth: '640px' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--line)' }}>
          <div>
            <span className="small text-uppercase fw-bold d-block text-muted-fc" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Consulta Pública (SSR)
            </span>
            <h1 className="h3 fw-bold mb-0" style={{ color: 'var(--ink)' }}>Estado de tu Pedido</h1>
          </div>
          <span
            className="badge text-uppercase px-3 py-2 rounded-pill"
            style={{ backgroundColor: colorBadge.bg, color: colorBadge.color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            ● {etiquetaEstado}
          </span>
        </div>

        <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
          <div className="row g-4">
            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Código Oficial</span>
              <strong className="fs-4 text-brand font-monospace">{pedido.codigo}</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Fecha y Hora de Recojo</span>
              <strong style={{ color: 'var(--ink)' }}>
                {pedido.fecha}{horaRecojo ? ` · ${horaRecojo}` : ''}
              </strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Plato Solicitado</span>
              <strong style={{ color: 'var(--ink)' }}>{plato ? plato.nombre : `Plato #${pedido.platoId}`}</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Cantidad</span>
              <strong style={{ color: 'var(--ink)' }}>{pedido.cantidad} unidad(es)</strong>
            </div>

            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Indicaciones</span>
              <span className="small text-muted-fc">{pedido.notas || 'Sin notas adicionales'}</span>
            </div>

            <div className="col-sm-6">
              <span className="small d-block text-muted-fc" style={{ fontSize: '0.75rem' }}>Total a Pagar</span>
              <strong className="fs-4" style={{ color: 'var(--moss)' }}>S/ {Number(pedido.precioTotal).toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Link href="/pedidos/buscar" className="btn fc-btn-secondary px-3 py-2">
            ← Rastrear otro código
          </Link>
          <Link href="/platos" className="btn fc-btn-brand px-4 py-2">
            Ver Catálogo de Platos
          </Link>
        </div>
      </div>
    </div>
  );
}
