import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { pedidosPorEstado } from '../core/estadisticas.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';

export function MisPedidosPage({ pedidos, onCancelar }) {
  useTituloPagina('Mis Pedidos');
  const { usuario } = useAuth();

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));
  const resumen = pedidosPorEstado(misPedidos);
  const nombres = new Map(db.platos.map((pl) => [Number(pl.id), pl.nombre]));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="m-0">Mis Pedidos</h2>
        <Link className="btn btn-primary" to="/nuevo-pedido">
          + Nuevo pedido
        </Link>
      </div>

      <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge text-bg-warning">Pendientes: {resumen.pendiente}</span>
        <span className="badge text-bg-success">En preparación: {resumen.aprobada}</span>
        <span className="badge text-bg-danger">Cancelados: {resumen.rechazada}</span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
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
                <td colSpan="8" className="text-center text-body-secondary">
                  Aún no has realizado pedidos.
                </td>
              </tr>
            ) : (
              misPedidos.map((ped) => (
                <tr key={ped.id}>
                  <td><strong>{ped.codigo}</strong></td>
                  <td>{nombres.get(Number(ped.platoId)) ?? `Plato #${ped.platoId}`}</td>
                  <td>{ped.fecha} {obtenerHoraPedido(ped)}</td>
                  <td>{ped.cantidad} unid.</td>
                  <td><strong>S/ {Number(ped.precioTotal).toFixed(2)}</strong></td>
                  <td><small className="text-body-secondary">{ped.notas || 'Sin notas'}</small></td>
                  <td><BadgeEstado estado={ped.estado} /></td>
                  <td className="text-end">
                    {ped.estado === 'pendiente' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
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
