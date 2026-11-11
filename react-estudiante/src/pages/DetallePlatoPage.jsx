import { Link, useParams } from 'react-router-dom';
import db from '../data/db.json';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';

export function DetallePlatoPage() {
  const { id } = useParams();
  const { estaAutenticado } = useAuth();
  const encontrado = db.platos.find((p) => Number(p.id) === Number(id));

  useTituloPagina(encontrado ? encontrado.nombre : 'Plato no encontrado');

  if (!encontrado) {
    return (
      <div className="alert alert-warning">
        <h4>Plato no encontrado</h4>
        <p className="mb-2">El plato con ID #{id} no existe en el menú actual.</p>
        <Link className="btn btn-outline-primary btn-sm" to="/catalogo">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const plato = new Plato(encontrado);

  return (
    <div className="card col-lg-8 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h2 className="card-title text-primary mb-1">{plato.nombre}</h2>
          <span className="badge text-bg-secondary fs-6">{plato.categoria}</span>
        </div>

        <p className="fs-3 fw-bold text-success mt-2 mb-3">S/ {plato.precio.toFixed(2)}</p>

        <p className="mb-3">
          <strong className="me-2">Estado:</strong>
          <BadgeEstado estado={plato.estado} />
        </p>

        <h6>Ingredientes y guarniciones</h6>
        <ul>
          {plato.ingredientes.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>

        <hr />
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-secondary" to="/catalogo">
            ← Volver al catálogo
          </Link>
          {estaAutenticado && plato.estaDisponible && (
            <Link className="btn btn-primary" to={`/nuevo-pedido?platoId=${plato.id}`}>
              Pedir este plato
            </Link>
          )}
          {!estaAutenticado && plato.estaDisponible && (
            <Link className="btn btn-outline-primary" to="/login">
              Inicia sesión para pedir
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
