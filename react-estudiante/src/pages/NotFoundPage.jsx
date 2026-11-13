import { Link } from 'react-router-dom';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export function NotFoundPage() {
  useTituloPagina('Página no encontrada');

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="fc-card-lg p-5 text-center" style={{ maxWidth: '460px' }}>
        <h1 className="display-2 fw-bold text-brand mb-2">404</h1>
        <h4 className="fw-bold mb-2">Ruta no encontrada</h4>
        <p className="text-muted-fc small mb-4">
          La sección que buscas no existe o fue movida en FoodCampus.
        </p>
        <Link className="btn fc-btn-brand px-4 py-2" to="/catalogo">
          Explorar catálogo
        </Link>
      </div>
    </div>
  );
}
