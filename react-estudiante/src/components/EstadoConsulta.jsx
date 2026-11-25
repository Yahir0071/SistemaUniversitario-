export function EstadoConsulta({ cargando, error, actualizar, mensajeCarga = 'Cargando…' }) {
  if (cargando) {
    return <p className="text-muted-fc py-3" role="status">{mensajeCarga}</p>;
  }
  if (!error) return null;
  return (
    <div className="alert alert-danger rounded-4 d-flex flex-wrap align-items-center gap-3" role="alert">
      <span>{error}</span>
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={actualizar}>Reintentar</button>
    </div>
  );
}
