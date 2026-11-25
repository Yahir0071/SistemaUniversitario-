import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada - FoodCampus',
  description: 'La página solicitada no existe en el portal público de FoodCampus.',
};

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="fc-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="display-4 fw-bold text-warning mb-2">404</h1>
        <h2 className="h4 fw-bold text-light mb-3">Página no encontrada</h2>
        <p className="text-secondary mb-4">
          La ruta que intentas visitar no existe en el portal público de FoodCampus.
        </p>
        <Link href="/" className="btn-primary-fc">
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
