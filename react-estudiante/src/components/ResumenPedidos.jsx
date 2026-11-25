export function ResumenPedidos({ resumen }) {
  return (
    <section className="fc-card p-3 mb-3" aria-labelledby="resumenPedidos">
      <h3 className="h6 fw-bold mb-2" id="resumenPedidos">Resumen por estado</h3>
      <dl className="d-flex flex-wrap gap-4 small mb-0" aria-live="polite">
        <div><dt>Pendientes</dt><dd className="mb-0">{resumen.pendiente}</dd></div>
        <div><dt>En preparación</dt><dd className="mb-0">{resumen.aprobada}</dd></div>
        <div><dt>Rechazados</dt><dd className="mb-0">{resumen.rechazada}</dd></div>
      </dl>
    </section>
  );
}
