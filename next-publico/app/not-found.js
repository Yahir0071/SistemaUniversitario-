import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada - FoodCampus',
  description: 'La página solicitada no existe en el portal público de FoodCampus.',
};

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="fc-card p-5 mx-auto" style={{ maxWidth: '560px' }}>
        <h1 className="display-4 fw-bold text-brand mb-2">404</h1>
        <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--ink)' }}>Página no encontrada</h2>
        <p className="text-muted-fc mb-4">
          La ruta o el plato que intentas visitar no existe en el portal público de FoodCampus.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link href="/" className="btn fc-btn-brand px-4 py-2">
            Ir al Inicio
          </Link>
          <Link href="/platos" className="btn fc-btn-secondary px-4 py-2">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
