import { Link, useParams } from 'react-router-dom';
import db from '../data/db.json';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
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
        <Link className="btn btn-outline-primary rounded-pill px-4 mt-2" to="/catalogo">← Volver al catálogo</Link>
      </div>
    );
  }

  const plato = new Plato(encontrado);
  const imagenUrl = obtenerImagenPlato(plato.id);
  const relacionados = db.platos.filter((p) => p.id !== plato.id && p.categoria === plato.categoria).slice(0, 3);

  return (
    <div className="py-2">
      <div className="row g-4 align-items-start mb-5">
        <div className="col-lg-6">
          <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '420px' }}>
            <img src={imagenUrl} alt={plato.nombre} className="w-100 h-100 object-fit-cover" />
          </div>
        </div>

        <div className="col-lg-6 d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-2 p-1" style={{ background: 'var(--fc-primary)' }}>🍱</span>
            <span className="small fw-semibold text-body-secondary">{plato.categoria}</span>
          </div>

          <h1 className="display-6 fw-bold mb-0">{plato.nombre}</h1>
          <p className="text-body-secondary mb-1">
            {plato.descripcion || 'Preparado fresco al momento por el equipo de cocina con ingredientes seleccionados del día.'}
          </p>

          <div className="d-flex gap-2">
            <div className="stat-box"><div className="small text-secondary">Precio</div><div className="fw-bold fs-5">S/ {plato.precio.toFixed(2)}</div></div>
            <div className="stat-box"><div className="small text-secondary">⏱ Preparación</div><div className="fw-bold fs-5">15 min</div></div>
            <div className="stat-box"><div className="small text-secondary">🏬 Recojo</div><div className="fw-bold fs-6">Mostrador principal</div></div>
          </div>

          <div className="d-flex align-items-center gap-2 small">
            <span className={plato.estaDisponible ? 'status-pill status-disponible py-1' : 'status-pill status-agotado py-1'}>
              <span className="status-dot"></span> {plato.estaDisponible ? 'Disponible · 14 porciones' : 'Agotado'}
            </span>
            <span className="text-body-secondary">Puedes reservarlo para hoy o los próximos días.</span>
          </div>

          <div>
            <div className="text-uppercase small fw-bold text-secondary mb-2" style={{ letterSpacing: '0.05em' }}>Ingredientes</div>
            <div className="d-flex flex-wrap gap-2">
              {plato.ingredientes.map((ing) => (
                <span key={ing} className="ingredient-pill">{ing}</span>
              ))}
            </div>
          </div>

          <div className="stat-box d-flex align-items-center justify-content-between p-3 mt-2">
            <div>
              <div className="small text-secondary">Precio por unidad</div>
              <div className="fs-4 fw-bold">S/ {plato.precio.toFixed(2)}</div>
              <div className="text-secondary small" style={{ fontSize: '0.72rem' }}>Elige la cantidad, fecha y hora de recojo en el siguiente paso.</div>
            </div>
            {plato.estaDisponible ? (
              <Link className="btn btn-primary px-4 py-2" to={estaAutenticado ? `/nuevo-pedido?platoId=${plato.id}` : '/login'}>
                🛍️ Hacer pedido
              </Link>
            ) : (
              <button className="btn btn-secondary rounded-pill px-4" disabled>Agotado</button>
            )}
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <h3 className="h5 fw-bold mb-3">Más en {plato.categoria}</h3>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {relacionados.map((item) => (
              <div className="col" key={item.id}>
                <Link to={`/platos/${item.id}`} className="text-decoration-none text-reset">
                  <div className="card card-plato h-100 p-2">
                    <img src={obtenerImagenPlato(item.id)} alt={item.nombre} className="rounded-3 w-100 object-fit-cover mb-2" style={{ height: '140px' }} />
                    <div className="px-2 pb-1 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="small text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>{item.categoria}</div>
                        <div className="fw-bold small">{item.nombre}</div>
                      </div>
                      <span className="fw-bold text-success small">S/ {item.precio.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
