import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catálogo Público - FoodCampus SSR',
  description: 'Catálogo público de platos y bebidas de FoodCampus generado en el servidor.',
};

const IMAGENES = {
  1: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lomo_saltado_peruano.jpg?width=800',
  2: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aj%C3%AD_de_gallina_-_Tradicional.jpg?width=800',
  3: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
  4: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
  5: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
  6: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80',
  7: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80',
  8: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80',
};

function obtenerImagen(id, urlOpcional) {
  if (urlOpcional && urlOpcional.trim()) return urlOpcional.trim();
  return IMAGENES[Number(id)] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';
}

async function obtenerPlatos() {
  try {
    const res = await fetch('http://localhost:3000/platos', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al consultar el catálogo');
    return await res.json();
  } catch (error) {
    console.error('Error cargando platos SSR:', error);
    return [];
  }
}

export default async function PlatosPage() {
  const platos = await obtenerPlatos();

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <span className="text-uppercase fw-bold small text-brand" style={{ letterSpacing: '0.06em' }}>
            Menú de la cafetería (Renderizado SSR)
          </span>
          <h1 className="h2 fw-bold m-0" style={{ letterSpacing: '-0.02em' }}>Catálogo Público</h1>
        </div>
        <span className="text-muted-fc small fw-medium">
          {platos.length} platos en carta
        </span>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {platos.map((plato) => (
          <div className="col" key={plato.id}>
            <div className={`fc-card fc-card-hover h-100 overflow-hidden d-flex flex-column ${plato.estado !== 'disponible' ? 'opacity-75' : ''}`}>
              <Link href={`/platos/${plato.id}`} className="fc-img-box d-block text-decoration-none">
                <img src={obtenerImagen(plato.id, plato.imagen)} alt={plato.nombre} loading="lazy" />
                <span className={`fc-badge fc-glass-badge ${plato.estado === 'disponible' ? 'fc-badge-disponible' : 'fc-badge-agotado'}`}>
                  <span className="fc-badge-dot" />
                  {plato.estado === 'disponible' ? 'Disponible' : 'Agotado'}
                </span>
              </Link>

              <div className="p-3 d-flex flex-column flex-grow-1">
                <span className="text-uppercase text-muted-fc fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                  {plato.categoria}
                </span>

                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <Link href={`/platos/${plato.id}`} className="fw-bold text-decoration-none fs-6" style={{ color: 'var(--ink)' }}>
                    {plato.nombre}
                  </Link>
                  <span className="fw-bold text-nowrap text-brand">S/ {Number(plato.precio).toFixed(2)}</span>
                </div>

                <p className="text-muted-fc small flex-grow-1 mb-3">
                  {plato.ingredientes?.slice(0, 4).join(' · ') || 'Preparación diaria'}
                </p>

                <Link href={`/platos/${plato.id}`} className="btn btn-sm fc-btn-secondary w-100 py-2">
                  Ver detalle e ingredientes (SSR) →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {platos.length === 0 && (
          <div className="col-12 text-center py-5">
            <p className="text-muted-fc">No se pudo cargar el catálogo o la API no está disponible en http://localhost:3000.</p>
          </div>
        )}
      </div>
    </div>
  );
}
