import { Link } from 'react-router-dom';
import { Plato } from '../core/modelos.js';
import { BadgeEstado } from './BadgeEstado.jsx';

export function TarjetaPlato({ plato, puedePedir = false }) {
  const modelo = new Plato(plato);

  return (
    <div className="card h-100 shadow-sm card-plato">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h5 className="card-title mb-0">{modelo.nombre}</h5>
          <BadgeEstado estado={modelo.estado} />
        </div>

        <div className="mb-2">
          <span className="badge text-bg-secondary">{modelo.categoria}</span>
        </div>

        <p className="fs-5 fw-bold text-success mb-2">S/ {modelo.precio.toFixed(2)}</p>

        <p className="card-text text-body-secondary small flex-grow-1">
          {modelo.ingredientes.join(', ')}
        </p>

        <div className="d-flex gap-2 mt-2">
          <Link className="btn btn-sm btn-outline-primary flex-grow-1" to={`/catalogo/${modelo.id}`}>
            Ver detalle
          </Link>
          {puedePedir && modelo.estaDisponible && (
            <Link className="btn btn-sm btn-primary" to={`/nuevo-pedido?platoId=${modelo.id}`}>
              Pedir
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
