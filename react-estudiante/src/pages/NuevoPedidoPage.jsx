import { Link, useSearchParams } from 'react-router-dom';
import db from '../data/db.json';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { FormularioPedido } from '../components/FormularioPedido.jsx';

export function NuevoPedidoPage({ pedidos, onAgregar }) {
  useTituloPagina('Nuevo Pedido');
  const { usuario } = useAuth();
  const [searchParams] = useSearchParams();
  const platoInicialId = searchParams.get('platoId') ?? '';

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="m-0">Registrar Nuevo Pedido</h2>
          <p className="text-body-secondary mb-0">
            Solicita tu plato indicando fecha y hora de recojo en cafetería.
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/mis-pedidos">
          Ver mis pedidos
        </Link>
      </div>

      <FormularioPedido
        key={platoInicialId}
        platos={db.platos}
        pedidosUsuario={misPedidos}
        usuarioId={usuario.id}
        platoInicialId={platoInicialId}
        onGuardar={onAgregar}
      />
    </div>
  );
}
