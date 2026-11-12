import { useState } from 'react';
import db from '../data/db.json';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ListaPlatos } from '../components/ListaPlatos.jsx';

const ICONOS = {
  Almuerzos: '🍱',
  'Platos de fondo': '🍱',
  Desayunos: '☕',
  Entradas: '🍲',
  Snacks: '🥪',
  Sándwiches: '🥪',
  Saludable: '🥗',
  Ensaladas: '🥗',
  Bebidas: '🥤',
  Postres: '🍰',
};

export function CatalogoPage() {
  useTituloPagina('Catálogo');
  const { estaAutenticado } = useAuth();
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');

  const categorias = categoriasUnicas(db.platos);
  const query = texto.trim().toLowerCase();

  const platosFiltrados = db.platos.filter((p) => {
    if (categoria && p.categoria !== categoria) return false;
    if (!query) return true;
    const m = new Plato(p);
    return m.nombre.toLowerCase().includes(query) || m.tieneIngrediente(query);
  });

  const disponiblesCount = platosFiltrados.filter((p) => new Plato(p).estaDisponible).length;

  return (
    <div className="py-2">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="small text-secondary text-uppercase fw-bold mb-3" style={{ letterSpacing: '0.06em' }}>
            Categorías
          </div>
          <button
            type="button"
            className={`cat-item-btn ${!categoria ? 'active' : ''}`}
            onClick={() => setCategoria('')}
          >
            <span><span className="me-2">⊞</span> Todos los platos</span>
            <span className="cat-badge-count">{db.platos.length}</span>
          </button>
          {categorias.map((cat) => {
            const cant = db.platos.filter((p) => p.categoria === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`cat-item-btn ${categoria === cat ? 'active' : ''}`}
                onClick={() => setCategoria(cat === categoria ? '' : cat)}
              >
                <span><span className="me-2">{ICONOS[cat] || '🍽️'}</span> {cat}</span>
                <span className="cat-badge-count">{cant}</span>
              </button>
            );
          })}
        </aside>

        <section className="col-lg-9">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <div className="small text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Menú de la cafetería
              </div>
              <h1 className="h3 fw-bold mb-0">Catálogo</h1>
            </div>

            <div style={{ minWidth: '260px' }}>
              <input
                type="search"
                className="form-control rounded-pill px-3 py-2"
                placeholder="🔍 Buscar plato o ingrediente..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
          </div>

          <div className="text-secondary small mb-3">
            <strong>{platosFiltrados.length} platos</strong> · {disponiblesCount} disponibles
          </div>

          <ListaPlatos platos={platosFiltrados} puedePedir={estaAutenticado} />
        </section>
      </div>
    </div>
  );
}
