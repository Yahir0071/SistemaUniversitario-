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
  const cantidadInicial = searchParams.get('cantidad') ?? 1;

  const misPedidos = pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Registrar nuevo pedido</h2>
          <p className="text-muted-fc small mb-0">
            Elige fecha y horario de recojo para evitar filas en el Módulo Central.
          </p>
        </div>
        <Link className="btn fc-btn-outline px-3" to="/mis-pedidos">
          Ver mis pedidos
        </Link>
      </div>

      <FormularioPedido
        key={`${platoInicialId}-${cantidadInicial}`}
        platos={db.platos}
        pedidosUsuario={misPedidos}
        usuarioId={usuario.id}
        platoInicialId={platoInicialId}
        cantidadInicial={cantidadInicial}
        onGuardar={onAgregar}
      />
    </div>
  );
}
