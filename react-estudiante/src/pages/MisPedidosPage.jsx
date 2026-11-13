import { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { Pedido } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { ModalCancelarPedido } from '../components/ModalCancelarPedido.jsx';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function MisPedidosPage({ pedidos, onCancelar }) {
  useTituloPagina('Mis Pedidos');
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('todos');
  const [pedidoACancelar, setPedidoACancelar] = useState(null);

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));
  const activos = misPedidos.filter((p) => new Pedido(p).estaActivo);
  const finalizados = misPedidos.filter((p) => !new Pedido(p).estaActivo);
  const listaVisible = filtro === 'activos' ? activos : filtro === 'finalizados' ? finalizados : misPedidos;
  const nombres = new Map(db.platos.map((pl) => [Number(pl.id), pl.nombre]));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Mis pedidos</h2>
          <p className="text-muted-fc small mb-0">{usuario.nombre} · Código {usuario.codigo}</p>
        </div>
        <Link className="btn fc-btn-brand px-4" to="/nuevo-pedido">+ Nuevo pedido</Link>
      </div>

      <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />

      <div className="d-flex flex-wrap gap-2 mb-3">
        {[
          { id: 'todos', label: 'Todos', count: misPedidos.length },
          { id: 'activos', label: 'Activos', count: activos.length },
          { id: 'finalizados', label: 'Finalizados', count: finalizados.length },
        ].map((tab) => (
          <button key={tab.id} type="button" className={`fc-chip ${filtro === tab.id ? 'active' : ''}`} onClick={() => setFiltro(tab.id)}>
            {tab.label} <span className="fc-chip-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="fc-card p-2 table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr className="small text-muted-fc">
              <th>Código</th><th>Plato</th><th>Recojo</th><th>Total</th><th>Estado</th><th className="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {listaVisible.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted-fc py-4">No hay pedidos en esta categoría.</td></tr>
            ) : (
              listaVisible.map((ped) => (
                <tr key={ped.id}>
                  <td><strong className="font-monospace">{ped.codigo}</strong></td>
                  <td>
                    <Link to={`/catalogo/${ped.platoId}`} className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: 'var(--ink)' }}>
                      <img src={obtenerImagenPlato(ped.platoId)} alt="" className="fc-thumb-sm" />
                      <div>
                        <div className="fw-semibold small">{nombres.get(Number(ped.platoId)) ?? `Plato #${ped.platoId}`}</div>
                        <div className="text-muted-fc" style={{ fontSize: '0.75rem' }}>{ped.cantidad} unid. {ped.notas ? `· ${ped.notas}` : ''}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="small">{ped.fecha} · {obtenerHoraPedido(ped)}</td>
                  <td><strong className="text-brand">S/ {Number(ped.precioTotal).toFixed(2)}</strong></td>
                  <td><BadgeEstado estado={ped.estado} /></td>
                  <td className="text-end">
                    {ped.estado === 'pendiente' && (
                      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => setPedidoACancelar(ped)}>
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

      <ModalCancelarPedido
        pedido={pedidoACancelar}
        nombrePlato={pedidoACancelar ? nombres.get(Number(pedidoACancelar.platoId)) ?? 'Plato' : ''}
        onCerrar={() => setPedidoACancelar(null)}
        onConfirmar={() => { onCancelar(pedidoACancelar.id); setPedidoACancelar(null); }}
      />
    </div>
  );
}
