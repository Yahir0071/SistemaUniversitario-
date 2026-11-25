import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlatos } from '../hooks/usePlatos.js';
import { usePedidos } from '../hooks/usePedidos.js';
import { EstadoConsulta } from '../components/EstadoConsulta.jsx';
import { ResumenPedidos } from '../components/ResumenPedidos.jsx';
import { Pedido } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { ModalCancelarPedido } from '../components/ModalCancelarPedido.jsx';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function MisPedidosPage() {
  useTituloPagina('Mis Pedidos');
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('todos');
  const [pedidoACancelar, setPedidoACancelar] = useState(null);

  const [errorCancelacion, setErrorCancelacion] = useState('');
  const pedidos = usePedidos(usuario.id);
  const menu = usePlatos();
  const misPedidos = pedidos.datos;
  const activos = misPedidos.filter((p) => new Pedido(p).estaActivo);
  const finalizados = misPedidos.filter((p) => !new Pedido(p).estaActivo);
  const listaVisible = filtro === 'activos' ? activos : filtro === 'finalizados' ? finalizados : misPedidos;
  const nombres = new Map(menu.datos.map((pl) => [Number(pl.id), pl.nombre]));

  function abrirCancelacion(pedido) {
    setErrorCancelacion('');
    setPedidoACancelar(pedido);
  }

  async function confirmarCancelacion() {
    setErrorCancelacion('');
    try {
      await pedidos.cancelar(pedidoACancelar.id);
      setPedidoACancelar(null);
    } catch (error) {
      setErrorCancelacion(error.message);
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Mis pedidos</h2>
          <p className="text-muted-fc small mb-0">{usuario.nombre} · Código {usuario.codigo}</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn fc-btn-outline" onClick={pedidos.actualizar} disabled={pedidos.cargando || pedidos.guardando}>
            Actualizar pedidos
          </button>
          <Link className="btn fc-btn-brand px-4" to="/nuevo-pedido">+ Nuevo pedido</Link>
        </div>
      </div>

      <EstadoConsulta {...pedidos} mensajeCarga="Cargando tus pedidos…" />
      <EstadoConsulta {...menu} mensajeCarga="Cargando nombres de los platos…" />
      {!menu.cargando && !menu.error && menu.datos.length === 0 && (
        <p className="text-muted-fc">El catálogo está vacío. Los pedidos muestran el identificador del plato.</p>
      )}
      {!pedidos.cargando && !pedidos.error && (
        <>
          <ResumenPedidos resumen={pedidos.resumen} />
          <ContadorProximoPedido pedidos={misPedidos} platos={menu.datos} />

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

          <TablaPedidos pedidos={listaVisible} total={misPedidos.length} nombres={nombres} onCancelar={abrirCancelacion} />
        </>
      )}
      <ModalCancelarPedido
        pedido={pedidoACancelar}
        nombrePlato={pedidoACancelar ? nombres.get(Number(pedidoACancelar.platoId)) ?? 'Plato' : ''}
        onCerrar={() => setPedidoACancelar(null)}
        onConfirmar={confirmarCancelacion}
        guardando={pedidos.guardando}
        error={errorCancelacion}
      />
    </div>
  );
}

function TablaPedidos({ pedidos, total, nombres, onCancelar }) {
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
            pedidos.map((ped) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
