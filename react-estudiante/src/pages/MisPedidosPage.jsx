import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlatos } from '../hooks/usePlatos.js';
import { usePedidos } from '../hooks/usePedidos.js';
import { EstadoConsulta } from '../components/EstadoConsulta.jsx';
import { ResumenPedidos } from '../components/ResumenPedidos.jsx';
import { Pedido } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { ModalCancelarPedido } from '../components/ModalCancelarPedido.jsx';
import { TablaPedidos } from '../components/TablaPedidos.jsx';

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
  const platosMapa = new Map(menu.datos.map((pl) => [Number(pl.id), pl]));

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

          <TablaPedidos pedidos={listaVisible} total={misPedidos.length} platosMapa={platosMapa} onCancelar={abrirCancelacion} />
        </>
      )}
      <ModalCancelarPedido
        pedido={pedidoACancelar}
        nombrePlato={pedidoACancelar ? platosMapa.get(Number(pedidoACancelar.platoId))?.nombre ?? 'Plato' : ''}
        onCerrar={() => setPedidoACancelar(null)}
        onConfirmar={confirmarCancelacion}
        guardando={pedidos.guardando}
        error={errorCancelacion}
      />
    </div>
  );
}
