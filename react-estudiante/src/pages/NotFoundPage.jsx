import { Link } from 'react-router-dom';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export function NotFoundPage() {
  useTituloPagina('Página no encontrada');

  return (
    <div className="text-center py-5">
      <h1 className="display-3 fw-bold text-secondary">404</h1>
      <p className="lead mb-4">La ruta solicitada no existe en FoodCampus.</p>
      <Link className="btn btn-primary" to="/catalogo">
        Ir al catálogo
      </Link>
    </div>
  );
}
