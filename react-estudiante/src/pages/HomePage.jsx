import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';
import { TarjetaPlato } from '../components/TarjetaPlato.jsx';

export function HomePage({ pedidos }) {
  useTituloPagina('Inicio');
  const { usuario, estaAutenticado } = useAuth();

  const disponibles = db.platos.filter((p) => new Plato(p).estaDisponible).length;
  const categorias = categoriasUnicas(db.platos);
  const misPedidos = estaAutenticado
    ? pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id))
    : [];
  const destacados = db.platos.slice(0, 3);

  return (
    <div className="py-2">
      <div className="hero-box p-4 p-md-5 mb-4 shadow-sm">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-body-tertiary border mb-3 small fw-medium">
          <span className="text-warning">●</span> Menú universitario de hoy · {disponibles} platos listos
        </div>
        <h1 className="display-6 fw-bold mb-2">¿Qué vas a comer hoy?</h1>
        <p className="lead text-body-secondary mb-4 col-lg-8" style={{ fontSize: '1.05rem' }}>
          {estaAutenticado
            ? `Bienvenido de vuelta, ${usuario.nombre}. Elige tu almuerzo o snack favorito y recógelo sin colas.`
            : 'Explora los platos del día en la cafetería, revisa ingredientes en tiempo real y pide con anticipación.'}
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-primary rounded-pill px-4" to="/catalogo">
            Explorar catálogo
          </Link>
          {estaAutenticado ? (
            <Link className="btn btn-outline-secondary rounded-pill px-4" to="/nuevo-pedido">
              + Nuevo pedido
            </Link>
          ) : (
            <Link className="btn btn-outline-secondary rounded-pill px-4" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {estaAutenticado && <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />}

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card h-100 card-plato p-3">
            <h6 className="text-body-secondary small text-uppercase fw-bold mb-1">Platos disponibles</h6>
            <p className="display-6 fw-bold text-success mb-0">{disponibles}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 card-plato p-3">
            <h6 className="text-body-secondary small text-uppercase fw-bold mb-1">Categorías del menú</h6>
            <p className="display-6 fw-bold mb-0" style={{ color: 'var(--fc-primary)' }}>{categorias.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 card-plato p-3">
            <h6 className="text-body-secondary small text-uppercase fw-bold mb-1">Tus pedidos registrados</h6>
            <p className="display-6 fw-bold mb-0">{estaAutenticado ? misPedidos.length : 0}</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 fw-bold m-0">Platos destacados</h3>
        <Link className="small text-decoration-none fw-semibold" style={{ color: 'var(--fc-primary)' }} to="/catalogo">
          Ver todo el menú →
        </Link>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {destacados.map((plato) => (
          <div className="col" key={plato.id}>
            <TarjetaPlato plato={plato} puedePedir={estaAutenticado} />
          </div>
        ))}
      </div>
    </div>
  );
}
