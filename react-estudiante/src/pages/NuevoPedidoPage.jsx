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
    <div className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Nuevo pedido</h1>
          <p className="text-body-secondary small mb-0">Elige cuánto quieres y cuándo lo recoges.</p>
        </div>
        <Link className="btn btn-sm btn-outline-secondary rounded-pill px-3" to="/mis-pedidos">
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
