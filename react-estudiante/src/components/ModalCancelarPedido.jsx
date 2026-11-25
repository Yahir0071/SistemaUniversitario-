import { obtenerHoraPedido } from '../utils/pedidoValidation.js';

export function ModalCancelarPedido({ pedido, nombrePlato, onCerrar, onConfirmar, guardando, error }) {
  if (!pedido) return null;

  return (
    <div className="fc-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="tituloCancelar" aria-busy={guardando}>
      <div className="fc-card-lg p-4 w-100" style={{ maxWidth: '420px' }}>
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3 fs-4"
          style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--ochre-soft)', color: 'var(--ochre)' }}
        >
          ⚠️
        </div>
        <h5 className="fw-bold mb-2" id="tituloCancelar">¿Cancelar el pedido {pedido.codigo}?</h5>
        <p className="text-muted-fc small mb-4">
          {pedido.cantidad} × {nombrePlato} para el {pedido.fecha} a las {obtenerHoraPedido(pedido)}. Esta acción no se puede deshacer.
        </p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn fc-btn-outline px-3" onClick={onCerrar} disabled={guardando}>
            Mantener pedido
          </button>
          <button type="button" className="btn btn-danger rounded-3 fw-semibold px-3" onClick={onConfirmar} disabled={guardando}>
            {guardando ? 'Cancelando…' : 'Sí, cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}
