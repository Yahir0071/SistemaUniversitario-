import { Link, useSearchParams } from 'react-router-dom';
import { usePlatos } from '../hooks/usePlatos.js';
import { usePedidos } from '../hooks/usePedidos.js';
import { EstadoConsulta } from '../components/EstadoConsulta.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { FormularioPedido } from '../components/FormularioPedido.jsx';

export function NuevoPedidoPage() {
  useTituloPagina('Nuevo Pedido');
  const { usuario } = useAuth();
  const [searchParams] = useSearchParams();
  const platoInicialId = searchParams.get('platoId') ?? '';
  const cantidadInicial = searchParams.get('cantidad') ?? 1;

  const pedidos = usePedidos(usuario.id);
  const menu = usePlatos();
  const hayDisponibles = menu.datos.some((plato) => plato.estado === 'disponible');

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

      <EstadoConsulta {...menu} mensajeCarga="Cargando menú…" />
      <EstadoConsulta {...pedidos} mensajeCarga="Consultando tus pedidos para validar el horario…" />
      {!menu.cargando && !menu.error && !hayDisponibles && <p className="text-muted-fc">No hay platos disponibles para pedir.</p>}
      {hayDisponibles && !pedidos.cargando && !pedidos.error && (
        <FormularioPedido
          key={`${platoInicialId}-${cantidadInicial}`}
          platos={menu.datos}
          pedidosUsuario={pedidos.datos}
          usuarioId={usuario.id}
          platoInicialId={platoInicialId}
          cantidadInicial={cantidadInicial}
          onGuardar={pedidos.crear}
          guardando={pedidos.guardando}
        />
      )}
    </div>
  );
}
