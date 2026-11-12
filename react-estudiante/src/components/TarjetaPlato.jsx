import { Link } from 'react-router-dom';
import { Plato } from '../core/modelos.js';
import { BadgeEstado } from './BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function TarjetaPlato({ plato, puedePedir = false }) {
  const modelo = new Plato(plato);
  const imagenUrl = obtenerImagenPlato(modelo.id);

  return (
    <div className={`card h-100 card-plato ${!modelo.estaDisponible ? 'opacity-75' : ''}`}>
      <Link to={`/catalogo/${modelo.id}`} className="text-decoration-none text-reset">
        <div className="plato-img-container" style={{ height: '170px' }}>
          <img src={imagenUrl} alt={modelo.nombre} className="plato-img" loading="lazy" />
          <div className="badge-overlay">
            <BadgeEstado estado={modelo.estado} />
          </div>
        </div>
      </Link>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <span className="text-uppercase small fw-bold text-secondary" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
            {modelo.categoria}
          </span>
          <div className="d-flex justify-content-between align-items-baseline gap-2 mt-1">
            <h5 className="card-title fw-bold fs-6 mb-0 text-truncate" title={modelo.nombre}>
              {modelo.nombre}
            </h5>
            <span className="fw-bold fs-6 flex-shrink-0">S/ {modelo.precio.toFixed(2)}</span>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3 pt-2 border-top">
          <Link className="btn btn-sm btn-outline-secondary rounded-pill w-100" to={`/catalogo/${modelo.id}`}>
            Ver plato
          </Link>
          {puedePedir && modelo.estaDisponible && (
            <Link className="btn btn-sm btn-primary rounded-pill w-100" to={`/nuevo-pedido?platoId=${modelo.id}`}>
              Pedir
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
