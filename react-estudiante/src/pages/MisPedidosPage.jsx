import { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function MisPedidosPage({ pedidos, onCancelar }) {
  useTituloPagina('Mis Pedidos');
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('todos');

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));
  const nombres = new Map(db.platos.map((pl) => [Number(pl.id), pl.nombre]));
  const codigoEstudiante = usuario?.correo ? usuario.correo.split('@')[0].toUpperCase() : 'U20231234';

  const activos = misPedidos.filter((p) => p.estado === 'pendiente' || p.estado === 'aprobada');
  const finalizados = misPedidos.filter((p) => p.estado === 'rechazada' || p.estado === 'entregado');

  const pedidosVisibles = filtro === 'activos' ? activos : filtro === 'finalizados' ? finalizados : misPedidos;

  return (
    <div className="py-3">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <div className="small text-secondary fw-semibold mb-1" style={{ letterSpacing: '0.04em' }}>{codigoEstudiante}</div>
          <h1 className="fw-bold mb-0">Mis pedidos</h1>
        </div>

        <div className="nav-pill-container">
          <button type="button" className={`btn btn-sm rounded-pill px-3 border-0 ${filtro === 'todos' ? 'btn-primary' : 'text-secondary'}`} onClick={() => setFiltro('todos')}>
            Todos {misPedidos.length}
          </button>
          <button type="button" className={`btn btn-sm rounded-pill px-3 border-0 ${filtro === 'activos' ? 'btn-primary' : 'text-secondary'}`} onClick={() => setFiltro('activos')}>
            Activos {activos.length}
          </button>
          <button type="button" className={`btn btn-sm rounded-pill px-3 border-0 ${filtro === 'finalizados' ? 'btn-primary' : 'text-secondary'}`} onClick={() => setFiltro('finalizados')}>
            Finalizados {finalizados.length}
          </button>
        </div>
      </div>

      <div className="card card-plato overflow-hidden">
        <div className="table-responsive">
          <table className="table-orders mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Plato</th>
                <th>Recojo</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {pedidosVisibles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    <p className="mb-2">No hay pedidos en esta sección.</p>
                    <Link className="btn btn-sm btn-outline-primary rounded-pill px-4" to="/catalogo">Pedir algo ahora</Link>
                  </td>
                </tr>
              ) : (
                pedidosVisibles.map((ped) => (
                  <tr key={ped.id}>
                    <td><span className="order-code-text">{ped.codigo}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={obtenerImagenPlato(ped.platoId)} alt="" className="rounded-3 object-fit-cover flex-shrink-0" style={{ width: '44px', height: '44px' }} />
                        <div>
                          <div className="fw-bold small">{nombres.get(Number(ped.platoId)) ?? `Plato #${ped.platoId}`}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>{ped.cantidad} {ped.cantidad > 1 ? 'unidades' : 'unidad'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold small">{ped.fecha}</div>
                      <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>{ped.hora || '12:30'}</div>
                    </td>
                    <td><span className="fw-bold">S/ {Number(ped.precioTotal).toFixed(2)}</span></td>
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
