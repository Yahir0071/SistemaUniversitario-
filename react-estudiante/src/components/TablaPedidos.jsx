import { Link } from 'react-router-dom';
import { BadgeEstado } from './BadgeEstado.jsx';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function TablaPedidos({ pedidos, total, platosMapa, onCancelar }) {
  return (
    <div className="fc-card p-2 table-responsive" tabIndex={0} role="region" aria-label="Tabla de mis pedidos">
      <table className="table fc-table table-hover align-middle mb-0">
        <thead>
          <tr className="small text-muted-fc">
            <th scope="col">Código</th>
            <th scope="col">Plato</th>
            <th scope="col">Recojo</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col" className="text-end">Acción</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr><td colSpan="6" className="text-center text-muted-fc py-4">{total ? 'No hay pedidos en esta categoría.' : 'Todavía no tienes pedidos.'}</td></tr>
          ) : (
            pedidos.map((ped) => {
              const plato = platosMapa.get(Number(ped.platoId));
              return (
                <tr key={ped.id}>
                  <td><strong className="font-monospace">{ped.codigo}</strong></td>
                  <td>
                    <Link to={`/catalogo/${ped.platoId}`} className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: 'var(--ink)' }}>
                      <img src={obtenerImagenPlato(ped.platoId, plato?.imagen)} alt="" className="fc-thumb-sm" />
                      <div>
                        <div className="fw-semibold small">{plato?.nombre ?? `Plato #${ped.platoId}`}</div>
                        <div className="text-muted-fc" style={{ fontSize: '0.75rem' }}>{ped.cantidad} unid. {ped.notas ? `· ${ped.notas}` : ''}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="small text-nowrap">{ped.fecha} · {obtenerHoraPedido(ped)}</td>
                  <td><strong className="text-brand text-nowrap">S/ {Number(ped.precioTotal).toFixed(2)}</strong></td>
                  <td><BadgeEstado estado={ped.estado} /></td>
                  <td className="text-end">
                    {ped.estado === 'pendiente' && (
                      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onCancelar(ped)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
