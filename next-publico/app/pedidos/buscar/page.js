import Link from 'next/link';

export const metadata = {
  title: 'Consultar Estado de Pedido - FoodCampus',
  description: 'Rastreo y consulta pública del estado de un pedido en la cafetería FoodCampus.',
};

export default function BuscarPedidoPage() {
  return (
    <div className="container py-5">
      <div className="fc-card p-5 mx-auto" style={{ maxWidth: '580px', background: 'radial-gradient(ellipse at 50% 0%, var(--surface-raised) 0%, var(--surface) 100%)' }}>
        <div className="text-center mb-4">
          <span className="fc-squircle mx-auto mb-3">🔍</span>
          <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--ink)' }}>Rastrear Pedido por Código</h1>
          <p className="small mb-0" style={{ color: 'var(--ink-muted)' }}>
            Ingresa tu código oficial de orden (formato <code>PED-0001</code>) para consultar el estado de tu preparación sin iniciar sesión.
          </p>
        </div>

        <form action="/pedidos/redireccionar" method="GET" className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="codigo" className="form-label small fw-semibold text-uppercase" style={{ color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>
              Código de Pedido:
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              required
              placeholder="Ej. PED-0001"
              className="form-control form-control-lg text-center fw-bold"
              style={{
                backgroundColor: 'var(--surface-sunken)',
                color: 'var(--ink)',
                borderColor: 'var(--line)',
                borderRadius: '1rem',
                letterSpacing: '0.1em',
              }}
              pattern="[Pp][Ee][Dd]-\d{4}"
              title="Formato: PED-XXXX (ej. PED-0001)"
            />
          </div>

          <button type="submit" className="fc-btn-primary w-100 py-3 mt-2 fs-6">
            Rastrear Pedido (SSR) →
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'var(--line)' }}>
          <span className="small d-block mb-2" style={{ color: 'var(--ink-muted)' }}>Órdenes de demostración para probar:</span>
          <div className="d-flex justify-content-center gap-2">
            <Link href="/pedidos/PED-0001" className="fc-pill-badge text-decoration-none" style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>PED-0001</Link>
            <Link href="/pedidos/PED-0002" className="fc-pill-badge text-decoration-none" style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>PED-0002</Link>
            <Link href="/pedidos/PED-0003" className="fc-pill-badge text-decoration-none" style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>PED-0003</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
