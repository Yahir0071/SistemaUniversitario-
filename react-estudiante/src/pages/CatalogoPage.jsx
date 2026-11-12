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
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Catálogo de Platos</h2>
          <p className="text-body-secondary small mb-0">
            Descubre las opciones gastronómicas disponibles en el campus.
          </p>
        </div>
        <span className="badge rounded-pill bg-body-tertiary border text-body px-3 py-2">
          {platosFiltrados.length} opciones encontradas
        </span>
      </div>

      <div className="mb-3">
        <input
          type="search"
          className="form-control rounded-pill px-4 py-2"
          placeholder="🔍 Buscar plato por nombre o ingrediente..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        <button
          type="button"
          className={`category-chip ${!categoria ? 'active' : ''}`}
          onClick={() => setCategoria('')}
        >
          Todos ({db.platos.length})
        </button>
        {categorias.map((cat) => {
          const cantidad = db.platos.filter((p) => p.categoria === cat).length;
          return (
            <button
              key={cat}
              type="button"
              className={`category-chip ${categoria === cat ? 'active' : ''}`}
              onClick={() => setCategoria(cat === categoria ? '' : cat)}
            >
              {cat} ({cantidad})
            </button>
          );
        })}
        {(texto || categoria) && (
          <button
            type="button"
            className="btn btn-sm btn-link text-body-secondary ms-auto text-decoration-none"
            onClick={() => { setTexto(''); setCategoria(''); }}
          >
            Limpiar filtros ✕
          </button>
        )}
      </div>

      <ListaPlatos platos={platosFiltrados} puedePedir={estaAutenticado} />
    </div>
  );
}
