import { Link, useParams } from 'react-router-dom';
import db from '../data/db.json';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function DetallePlatoPage() {
  const { id } = useParams();
  const { estaAutenticado } = useAuth();
  const encontrado = db.platos.find((p) => Number(p.id) === Number(id));

  useTituloPagina(encontrado ? encontrado.nombre : 'Plato no encontrado');

  if (!encontrado) {
    return (
      <div className="alert alert-warning rounded-4 p-4">
        <h4>Plato no encontrado</h4>
        <p className="mb-3">El plato con ID #{id} no existe en el menú actual.</p>
        <Link className="btn btn-outline-primary rounded-pill px-4" to="/catalogo">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const plato = new Plato(encontrado);
  const imagenUrl = obtenerImagenPlato(plato.id);

  return (
    <div className="card card-plato shadow-sm p-3 p-md-4 col-lg-10 mx-auto">
      <div className="row g-4 align-items-center">
        <div className="col-md-5">
          <div className="position-relative overflow-hidden rounded-4 shadow-sm" style={{ height: '320px' }}>
            <img src={imagenUrl} alt={plato.nombre} className="w-100 h-100 object-fit-cover" />
            <div className="badge-overlay">
              <BadgeEstado estado={plato.estado} />
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge rounded-pill bg-body-tertiary border text-body px-3 py-1">
              {plato.categoria}
            </span>
          </div>

          <h2 className="fw-bold mb-2">{plato.nombre}</h2>
          <div className="fs-3 fw-bold text-success mb-3">S/ {plato.precio.toFixed(2)}</div>

          <h6 className="fw-semibold text-uppercase small text-body-secondary mb-2" style={{ letterSpacing: '0.05em' }}>
            Ingredientes y Guarniciones
          </h6>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {plato.ingredientes.map((ing) => (
              <span key={ing} className="badge rounded-pill bg-body-secondary text-body px-3 py-2 fw-normal">
                ✓ {ing}
              </span>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-2 pt-3 border-top">
            <Link className="btn btn-outline-secondary rounded-pill px-4" to="/catalogo">
              ← Volver
            </Link>
            {estaAutenticado && plato.estaDisponible && (
              <Link className="btn btn-primary rounded-pill px-4" to={`/nuevo-pedido?platoId=${plato.id}`}>
                Pedir este plato
              </Link>
            )}
            {!estaAutenticado && plato.estaDisponible && (
              <Link className="btn btn-primary rounded-pill px-4" to="/login">
                Iniciar sesión para pedir
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
