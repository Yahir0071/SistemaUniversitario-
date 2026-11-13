import { obtenerImagenPlato } from '../data/platosImagenes.js';

function formatearRecojo(fecha, hora) {
  if (!fecha) return `Sin fecha · ${hora || 'sin hora'}`;
  const [y, m, d] = fecha.split('-').map(Number);
  const f = new Date(y, m - 1, d).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${f} · ${hora || 'sin hora'}`;
}

export function ResumenPedidoCard({ platoActual, cantidad, fecha, hora, totalEstimado }) {
  return (
    <div className="fc-card-lg fc-sticky-panel overflow-hidden">
      {platoActual && (
        <img src={obtenerImagenPlato(platoActual.id, platoActual.imagen)} alt={platoActual.nombre} className="w-100 object-fit-cover" style={{ height: '150px' }} />
      )}
      <div className="p-4">
        <div className="small text-muted-fc text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.06em' }}>Resumen del pedido</div>
        <div className="fw-bold mb-3">{platoActual ? platoActual.nombre : 'Sin plato seleccionado'}</div>
        <div className="d-flex justify-content-between small mb-2">
          <span className="text-muted-fc">Precio unitario</span>
          <span>{platoActual ? `S/ ${platoActual.precio.toFixed(2)}` : '—'}</span>
        </div>
        <div className="d-flex justify-content-between small mb-2">
          <span className="text-muted-fc">Cantidad</span>
          <span>× {cantidad}</span>
        </div>
        <div className="d-flex justify-content-between small mb-3">
          <span className="text-muted-fc">Recojo</span>
          <span>{formatearRecojo(fecha, hora)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center py-3 mb-3 border-top" style={{ borderColor: 'var(--line)' }}>
          <span className="text-muted-fc">Total</span>
          <span className="fs-4 fw-bold">S/ {totalEstimado.toFixed(2)}</span>
        </div>
        <button type="submit" className="btn fc-btn-brand w-100 py-2">Confirmar pedido</button>
        <div className="small text-muted-fc text-center mt-2">Podrás cancelarlo mientras esté pendiente.</div>
      </div>
    </div>
  );
}
