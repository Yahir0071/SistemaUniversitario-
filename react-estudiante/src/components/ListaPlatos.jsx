import { TarjetaPlato } from './TarjetaPlato.jsx';

export function ListaPlatos({ platos, puedePedir = false }) {
  if (platos.length === 0) {
    return (
      <div className="alert alert-info mb-0">
        No se encontraron platos con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      {platos.map((plato) => (
        <div className="col" key={plato.id}>
          <TarjetaPlato plato={plato} puedePedir={puedePedir} />
        </div>
      ))}
    </div>
  );
}
