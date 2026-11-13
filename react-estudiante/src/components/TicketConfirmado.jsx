import { Link } from 'react-router-dom';
import { BadgeEstado } from './BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return 'Sin fecha';
  const [y, m, d] = fechaIso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'short' });
}

export function TicketConfirmado({ pedido, plato, nombrePlato, onNuevo }) {
  return (
    <div className="d-flex justify-content-center py-4">
      <div className="text-center w-100" style={{ maxWidth: '480px' }}>
        <div
          className="mx-auto mb-3 d-inline-flex align-items-center justify-content-center fs-4 fw-bold"
          style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.14)', color: '#10b981' }}
        >
          ✓
        </div>
        <h2 className="fw-bold mb-1">¡Pedido confirmado!</h2>
        <p className="text-muted-fc small mb-4">Muestra tu código en el mostrador para recogerlo.</p>

        <div className="fc-card text-start overflow-hidden mb-4">
          <div className="p-3 d-flex justify-content-between align-items-center gap-3 border-bottom" style={{ borderColor: 'var(--line)' }}>
            <div className="d-flex align-items-center gap-3">
              {plato && <img src={obtenerImagenPlato(plato.id, plato.imagen)} alt="" className="fc-thumb-sm" />}
              <div>
                <div className="fw-bold">{nombrePlato}</div>
                <div className="small text-muted-fc">{pedido.cantidad} × S/ {Number(pedido.precioUnitario).toFixed(2)}</div>
              </div>
            </div>
            <BadgeEstado estado={pedido.estado} />
          </div>

          <div className="p-4 text-center border-bottom" style={{ borderColor: 'var(--line)' }}>
            <div className="small text-muted-fc text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Código de pedido</div>
            <div className="fs-2 fw-bold font-monospace mt-1">{pedido.codigo}</div>
          </div>

          <div className="row g-0">
            <div className="col-6 p-3 border-end" style={{ borderColor: 'var(--line)' }}>
              <div className="small text-muted-fc">Recojo</div>
              <div className="fw-semibold small">{formatearFechaCorta(pedido.fecha)} · {pedido.hora}</div>
            </div>
            <div className="col-6 p-3">
              <div className="small text-muted-fc">Total</div>
              <div className="fw-bold fs-5">S/ {Number(pedido.precioTotal).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center mb-2">
          <Link className="btn fc-btn-brand px-4 py-2 flex-fill" to="/mis-pedidos">Ver mis pedidos</Link>
          <Link className="btn fc-btn-outline px-4 py-2 flex-fill" to="/catalogo">Seguir explorando</Link>
        </div>
        <button type="button" className="btn btn-link btn-sm text-muted-fc text-decoration-none" onClick={onNuevo}>
          Registrar otro pedido
        </button>
      </div>
    </div>
  );
}
