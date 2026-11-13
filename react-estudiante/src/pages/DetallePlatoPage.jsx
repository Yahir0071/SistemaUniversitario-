import { Link, useParams } from 'react-router-dom';
import db from '../data/db.json';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { BadgeEstado } from '../components/BadgeEstado.jsx';
import { TarjetaPlato } from '../components/TarjetaPlato.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

export function DetallePlatoPage() {
  const { id } = useParams();
  const { estaAutenticado } = useAuth();

  const encontrado = db.platos.find((p) => Number(p.id) === Number(id));
  useTituloPagina(encontrado ? encontrado.nombre : 'Plato no encontrado');

  if (!encontrado) {
    return (
      <div className="fc-card p-4 text-center">
        <h4 className="fw-bold">Plato no encontrado</h4>
        <p className="text-muted-fc mb-3">El plato #{id} no figura en el menú.</p>
        <Link className="btn fc-btn-brand px-4" to="/catalogo">← Volver al catálogo</Link>
      </div>
    );
  }

  const plato = new Plato(encontrado);
  const relacionados = db.platos.filter((p) => p.id !== plato.id).slice(0, 3);
  const descripcion = encontrado.descripcion || `Preparado al momento con ${plato.ingredientes.slice(0, 3).join(', ').toLowerCase()}.`;

  return (
    <div>
      <div className="mb-3">
        <Link to="/catalogo" className="text-decoration-none text-muted-fc small fw-semibold">
          ‹ Catálogo
        </Link>
      </div>

      <div className="row g-4 align-items-start mb-5">
        <div className="col-lg-5 col-xl-6">
          <div className="overflow-hidden" style={{ height: '420px', borderRadius: '24px', boxShadow: 'var(--card-shadow-lg)' }}>
            <img
              src={obtenerImagenPlato(plato.id, encontrado.imagen)}
              alt={plato.nombre}
              className={`w-100 h-100 object-fit-cover ${!plato.estaDisponible ? 'fc-img-agotado' : ''}`}
            />
          </div>
        </div>

        <div className="col-lg-7 col-xl-6">
          <span className="fc-meta-chip mb-2 d-inline-flex align-items-center gap-1">🍽️ {plato.categoria}</span>
          <h1 className="fw-bold display-6 mb-2">{plato.nombre}</h1>
          <p className="text-muted-fc mb-4">{descripcion}</p>

          <div className="row g-2 mb-3">
            <div className="col-4">
              <div className="fc-card p-3 h-100">
                <div className="small text-muted-fc">Precio</div>
                <div className="fw-bold fs-5">S/ {plato.precio.toFixed(2)}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="fc-card p-3 h-100">
                <div className="small text-muted-fc">⏱️ Preparación</div>
                <div className="fw-bold fs-5">15 <span className="fs-6 fw-normal text-muted-fc">min</span></div>
              </div>
            </div>
            <div className="col-4">
              <div className="fc-card p-3 h-100">
                <div className="small text-muted-fc">🏪 Recojo</div>
                <div className="fw-bold small mt-1">Mostrador principal</div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-4 small">
            <BadgeEstado estado={plato.estado} />
            <span className="text-muted-fc">
              {plato.estaDisponible ? 'Puedes reservarlo para hoy o los próximos días.' : 'No disponible por el momento.'}
            </span>
          </div>

          <div className="text-uppercase small fw-bold text-muted-fc mb-2" style={{ letterSpacing: '0.06em' }}>Ingredientes</div>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {plato.ingredientes.map((ing) => (
              <span key={ing} className="fc-meta-chip">{ing}</span>
            ))}
          </div>

          <div className="fc-card p-3">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div>
                <div className="small text-muted-fc">Precio por unidad</div>
                <div className="fs-4 fw-bold">S/ {plato.precio.toFixed(2)}</div>
              </div>
              {!plato.estaDisponible ? (
                <button type="button" className="btn btn-secondary rounded-pill px-4 py-2" disabled>Plato agotado</button>
              ) : (
                <Link className="btn fc-btn-brand px-4 py-2" to={estaAutenticado ? `/nuevo-pedido?platoId=${plato.id}` : '/login'}>
                  🛍️ Hacer pedido
                </Link>
              )}
            </div>
            {!estaAutenticado && plato.estaDisponible && (
              <div className="small text-muted-fc mt-2">Te pediremos iniciar sesión con tu correo institucional para continuar.</div>
            )}
          </div>
        </div>
      </div>

      <h4 className="h5 fw-bold mb-3">Otros platos que te pueden gustar</h4>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {relacionados.map((p) => (
          <div className="col" key={p.id}><TarjetaPlato plato={p} puedePedir={estaAutenticado} /></div>
        ))}
      </div>
    </div>
  );
}
