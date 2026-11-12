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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Mis Pedidos</h2>
          <p className="text-body-secondary small mb-0">Revisa el estado de tus órdenes en la cafetería.</p>
        </div>
        <Link className="btn btn-primary rounded-pill px-4" to="/nuevo-pedido">
          + Nuevo pedido
        </Link>
      </div>

      <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge rounded-pill bg-warning text-dark px-3 py-2">Pendientes: {resumen.pendiente}</span>
        <span className="badge rounded-pill bg-success text-white px-3 py-2">En preparación: {resumen.aprobada}</span>
        <span className="badge rounded-pill bg-danger text-white px-3 py-2">Cancelados: {resumen.rechazada}</span>
      </div>

      <div className="table-responsive card card-plato p-2">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Código</th>
              <th>Plato</th>
              <th>Fecha y hora</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Notas</th>
              <th>Estado</th>
              <th className="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {misPedidos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-body-secondary py-4">
                  Aún no has realizado pedidos.
                </td>
              </tr>
            ) : (
              misPedidos.map((ped) => (
                <tr key={ped.id}>
                  <td><strong>{ped.codigo}</strong></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={obtenerImagenPlato(ped.platoId)} alt="" className="order-thumb" />
                      <div>
                        <div className="fw-semibold small">{nombres.get(Number(ped.platoId)) ?? `Plato #${ped.platoId}`}</div>
                      </div>
                    </div>
                  </td>
                  <td>{ped.fecha} {obtenerHoraPedido(ped)}</td>
                  <td>{ped.cantidad} unid.</td>
                  <td><strong className="text-success">S/ {Number(ped.precioTotal).toFixed(2)}</strong></td>
                  <td><small className="text-body-secondary">{ped.notas || 'Sin notas'}</small></td>
                  <td><BadgeEstado estado={ped.estado} /></td>
                  <td className="text-end">
                    {ped.estado === 'pendiente' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => onCancelar(ped.id)}
                      >
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
  );
}
