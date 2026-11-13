import { Link } from 'react-router-dom';
import { Plato } from '../core/modelos.js';
import { BadgeEstado } from './BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function TarjetaPlato({ plato, puedePedir = false }) {
  const modelo = new Plato(plato);
  const imagenUrl = obtenerImagenPlato(modelo.id, plato.imagen);

  return (
    <div className="card fc-card fc-card-hover h-100 overflow-hidden">
      <Link to={`/catalogo/${modelo.id}`} className="fc-img-box d-block text-decoration-none">
        <img
          src={imagenUrl}
          alt={modelo.nombre}
          className={!modelo.estaDisponible ? 'fc-img-agotado' : ''}
          loading="lazy"
        />
        <span className="fc-badge-cat">{modelo.categoria}</span>
        <div className="fc-badge-stock">
          <BadgeEstado estado={modelo.estado} />
        </div>
      </Link>

      <div className="card-body d-flex flex-column p-3">
        <Link to={`/catalogo/${modelo.id}`} className="text-decoration-none" style={{ color: 'var(--ink)' }}>
          <h5 className="fw-bold mb-1 fs-6 text-truncate" title={modelo.nombre}>
            {modelo.nombre}
          </h5>
        </Link>

        <p className="text-muted-fc small flex-grow-1 mb-3" style={{ minHeight: '2.4rem' }}>
          {modelo.ingredientes.join(' · ')}
        </p>

        <div
          className="d-flex align-items-center justify-content-between pt-2 mt-auto border-top"
          style={{ borderColor: 'var(--line-subtle)' }}
        >
          <div>
            <span className="text-muted-fc d-block" style={{ fontSize: '0.7rem' }}>Precio</span>
            <span className="fs-5 fw-bold" style={{ color: 'var(--ink)' }}>
              S/ {modelo.precio.toFixed(2)}
            </span>
          </div>

          <div className="d-flex gap-2">
            <Link className="btn btn-sm fc-btn-outline rounded-pill px-3" to={`/catalogo/${modelo.id}`}>
              Detalle
            </Link>
            {puedePedir && modelo.estaDisponible ? (
              <Link className="btn btn-sm fc-btn-brand rounded-pill px-3" to={`/nuevo-pedido?platoId=${modelo.id}`}>
                Pedir
              </Link>
            ) : !modelo.estaDisponible ? (
              <span className="btn btn-sm btn-secondary rounded-pill px-3 disabled" aria-disabled="true">
                Agotado
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
