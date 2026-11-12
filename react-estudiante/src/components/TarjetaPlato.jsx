import { Link } from 'react-router-dom';
import { Plato } from '../core/modelos.js';
import { BadgeEstado } from './BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function TarjetaPlato({ plato, puedePedir = false }) {
  const modelo = new Plato(plato);
  const imagenUrl = obtenerImagenPlato(modelo.id);

  return (
    <div className={`card h-100 card-plato ${!modelo.estaDisponible ? 'opacity-75' : ''}`}>
      <div className="plato-img-container">
        <img
          src={imagenUrl}
          alt={modelo.nombre}
          className="plato-img"
          loading="lazy"
        />
        <div className="badge-overlay">
          <BadgeEstado estado={modelo.estado} />
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="mb-1">
          <span
            className="text-uppercase small fw-bold text-body-secondary"
            style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}
          >
            {modelo.categoria}
          </span>
        </div>

        <h5 className="card-title fw-semibold mb-1 fs-6 text-truncate" title={modelo.nombre}>
          {modelo.nombre}
        </h5>

        <p className="card-text text-body-secondary small flex-grow-1 mb-2" style={{ minHeight: '2.4rem' }}>
          {modelo.ingredientes.join(' · ')}
        </p>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
          <div>
            <span className="small text-body-secondary d-block" style={{ fontSize: '0.7rem' }}>
              Precio
            </span>
            <span className="fs-5 fw-bold text-success">S/ {modelo.precio.toFixed(2)}</span>
          </div>

          <div className="d-flex gap-1">
            <Link className="btn btn-sm btn-outline-secondary rounded-pill px-3" to={`/catalogo/${modelo.id}`}>
              Detalle
            </Link>
            {puedePedir && modelo.estaDisponible && (
              <Link className="btn btn-sm btn-primary rounded-pill px-3" to={`/nuevo-pedido?platoId=${modelo.id}`}>
                Pedir
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
