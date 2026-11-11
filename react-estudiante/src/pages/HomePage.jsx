import { Link } from 'react-router-dom';
import db from '../data/db.json';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ContadorProximoPedido } from '../components/ContadorProximoPedido.jsx';

export function HomePage({ pedidos }) {
  useTituloPagina('Inicio');
  const { usuario, estaAutenticado } = useAuth();

  const disponibles = db.platos.filter((p) => new Plato(p).estaDisponible).length;
  const categorias = categoriasUnicas(db.platos);
  const misPedidos = estaAutenticado
    ? pedidos.filter((p) => Number(p.usuarioId) === Number(usuario.id))
    : [];

  return (
    <div className="py-2">
      <div className="p-4 p-md-5 mb-4 rounded-3 bg-body-tertiary border">
        <h1 className="display-6 fw-bold">Portal del Estudiante — FoodCampus</h1>
        <p className="lead mb-3">
          {estaAutenticado
            ? `Bienvenido, ${usuario.nombre} (${usuario.codigo}). Explora el menú del día y gestiona tus pedidos.`
            : 'Explora el menú universitario de hoy, revisa ingredientes y realiza pedidos anticipados iniciando sesión.'}
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/catalogo">
            Ver catálogo de platos
          </Link>
          {estaAutenticado ? (
            <Link className="btn btn-outline-success" to="/nuevo-pedido">
              + Nuevo pedido
            </Link>
          ) : (
            <Link className="btn btn-outline-primary" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {estaAutenticado && <ContadorProximoPedido pedidos={misPedidos} platos={db.platos} />}

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-body-secondary">Platos disponibles</h6>
              <p className="display-6 fw-bold text-success mb-0">{disponibles}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-body-secondary">Categorías del menú</h6>
              <p className="display-6 fw-bold text-primary mb-0">{categorias.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-body-secondary">Tus pedidos registrados</h6>
              <p className="display-6 fw-bold mb-0">{estaAutenticado ? misPedidos.length : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
