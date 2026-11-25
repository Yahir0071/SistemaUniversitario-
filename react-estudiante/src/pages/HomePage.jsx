import { Link } from 'react-router-dom';
import { usePlatos } from '../hooks/usePlatos.js';
import { usePedidos } from '../hooks/usePedidos.js';
import { EstadoConsulta } from '../components/EstadoConsulta.jsx';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { TarjetaPlato } from '../components/TarjetaPlato.jsx';

const ICONOS_CAT = { Almuerzos: '🍽️', Desayunos: '☕', Snacks: '🍔', Saludable: '🥗', Bebidas: '🥤', Postres: '🍰' };

export function HomePage() {
  useTituloPagina('Inicio');
  const { usuario, estaAutenticado } = useAuth();

  const menu = usePlatos();
  const platos = menu.datos;
  const pedidos = usePedidos(usuario?.id);
  const disponibles = platos.filter((p) => new Plato(p).estaDisponible).length;
  const categorias = categoriasUnicas(platos);
  const misPedidos = pedidos.datos;
  const destacados = platos.slice(0, 3);

  return (
    <div>
      <section className="fc-hero p-4 p-md-5 mb-4 d-flex align-items-center text-white">
        <div className="col-lg-7">
          <span className="fc-hero-badge mb-3">Cafetería Universitaria UTP{!menu.cargando && !menu.error && ` · ${disponibles} disponibles`}</span>
          <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
            Pide tu comida sin hacer colas.
          </h1>
          <p className="mb-4 text-white-50 fs-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {estaAutenticado
              ? `Hola ${usuario.nombre.split(' ')[0]}, reserva tus platos favoritos y recógelos a la hora exacta en el módulo central.`
              : 'Reserva tus platos favoritos del menú diario y recógelos a la hora exacta en el módulo central.'}
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn fc-btn-brand px-4 py-2" to="/catalogo">Ver catálogo</Link>
            <Link
              className="btn px-4 py-2 text-white fw-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '14px' }}
              to={estaAutenticado ? '/mis-pedidos' : '/login'}
            >
              {estaAutenticado
                ? `Mis pedidos${pedidos.cargando || pedidos.error ? '' : ` (${misPedidos.length})`}`
                : 'Iniciar sesión'}
            </Link>
          </div>
        </div>
      </section>

      {estaAutenticado && <EstadoConsulta {...pedidos} mensajeCarga="Cargando tus pedidos…" />}
      {estaAutenticado && !pedidos.cargando && !pedidos.error && <ContadorProximoPedido pedidos={misPedidos} platos={platos} />}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">⏱️ Tiempo estimado</span>
            <p className="fs-4 fw-bold mb-0 mt-1">15 - 20 min</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">📍 Punto de entrega</span>
            <p className="fs-4 fw-bold mb-0 mt-1 text-brand">Módulo Central</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fc-card p-3 h-100">
            <span className="text-muted-fc small fw-semibold">📱 Recojo 100% digital</span>
            <p className="fs-4 fw-bold mb-0 mt-1" style={{ color: 'var(--moss)' }}>{menu.cargando || menu.error ? 'Menú del día' : `${disponibles} platos hoy`}</p>
          </div>
        </div>
      </div>

      <EstadoConsulta {...menu} mensajeCarga="Cargando menú…" />
      {!menu.cargando && !menu.error && platos.length === 0 && <p className="text-muted-fc">Todavía no hay platos en el menú.</p>}
      {platos.length > 0 && (
        <>
          <h3 className="h5 fw-bold mb-3">Categorías</h3>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 mb-5">
            {categorias.map((cat) => (
              <div className="col" key={cat}>
                <Link to={`/catalogo?categoria=${encodeURIComponent(cat)}`} className="fc-card fc-card-hover p-3 text-center d-block text-decoration-none">
                  <div className="fs-3 mb-1">{ICONOS_CAT[cat] ?? '🍴'}</div>
                  <div className="fw-semibold small">{cat}</div>
                  <div className="text-muted-fc" style={{ fontSize: '0.75rem' }}>
                    {platos.filter((p) => p.categoria === cat).length} platos
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5 fw-bold m-0">Favoritos de la semana</h3>
            <Link className="small fw-semibold text-decoration-none text-brand" to="/catalogo">Ver todo el menú →</Link>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {destacados.map((plato) => (
              <div className="col" key={plato.id}><TarjetaPlato plato={plato} puedePedir={estaAutenticado} /></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
