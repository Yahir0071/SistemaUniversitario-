import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { pedidosPorEstado } from '../core/estadisticas.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function MisPedidosPage({ pedidos, onCancelar }) {
  useTituloPagina('Mis Pedidos');
  const { usuario } = useAuth();

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));
  const resumen = pedidosPorEstado(misPedidos);
  const nombres = new Map(db.platos.map((pl) => [Number(pl.id), pl.nombre]));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 fs-3">Mis Pedidos</h2>
          <p className="text-body-secondary small mb-0">Revisa el estado de tus órdenes en la cafetería en tiempo real.</p>
        </div>
        <Link className="btn btn-primary rounded-pill px-4 shadow-sm" to="/nuevo-pedido">
          + Nuevo pedido
        </Link>
      </div>

      <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />

      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        <span className="status-pill status-pendiente"><span className="status-dot" /> Pendientes: {resumen.pendiente}</span>
        <span className="status-pill status-aprobada"><span className="status-dot" /> En preparación: {resumen.aprobada}</span>
        <span className="status-pill status-rechazada"><span className="status-dot" /> Cancelados: {resumen.rechazada}</span>
      </div>

      <div className="card card-plato overflow-hidden">
        <div className="table-responsive">
          <table className="table-orders mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Plato</th>
                <th>Fecha y Hora</th>
                <th>Cant.</th>
                <th>Total</th>
                <th>Notas</th>
                <th>Estado</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {misPedidos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-body-secondary">
                    <p className="mb-2">Aún no has registrado pedidos.</p>
                    <Link className="btn btn-sm btn-outline-primary rounded-pill px-4" to="/catalogo">Explorar Menú</Link>
                  </td>
                </tr>
              ) : (
                misPedidos.map((ped) => (
                  <tr key={ped.id}>
                    <td><span className="order-code-badge">{ped.codigo}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={obtenerImagenPlato(ped.platoId)} alt="" className="order-thumb flex-shrink-0" />
                        <div>
                          <div className="fw-semibold text-body mb-0" style={{ fontSize: '0.92rem' }}>
                            {nombres.get(Number(ped.platoId)) ?? `Plato #${ped.platoId}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="small text-body-secondary">{ped.fecha} <strong className="text-body">{obtenerHoraPedido(ped)}</strong></td>
                    <td className="fw-medium small">{ped.cantidad} unid.</td>
                    <td><span className="fw-bold text-success" style={{ fontSize: '0.95rem' }}>S/ {Number(ped.precioTotal).toFixed(2)}</span></td>
                    <td className="small text-body-secondary" style={{ maxWidth: '140px' }}><div className="text-truncate">{ped.notas || '—'}</div></td>
                    <td><BadgeEstado estado={ped.estado} /></td>
                    <td className="text-end">
                      {ped.estado === 'pendiente' && (
                        <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onCancelar(ped.id)}>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
