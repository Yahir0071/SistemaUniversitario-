import { useState } from 'react';
import db from '../data/db.json';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ListaPlatos } from '../components/ListaPlatos.jsx';

export function CatalogoPage() {
  useTituloPagina('Catálogo');
  const { estaAutenticado } = useAuth();
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');

  const categorias = categoriasUnicas(db.platos);
  const query = texto.trim().toLowerCase();

  const platosFiltrados = db.platos.filter((p) => {
    const coincideCat = !categoria || p.categoria === categoria;
    if (!coincideCat) return false;
    if (!query) return true;
    const modelo = new Plato(p);
    return modelo.nombre.toLowerCase().includes(query) || modelo.tieneIngrediente(query);
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="m-0">Catálogo de Platos</h2>
        <span className="text-body-secondary small">{platosFiltrados.length} resultados</span>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o ingrediente..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {(texto || categoria) && (
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setTexto('');
                setCategoria('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <ListaPlatos platos={platosFiltrados} puedePedir={estaAutenticado} />
    </div>
  );
}
