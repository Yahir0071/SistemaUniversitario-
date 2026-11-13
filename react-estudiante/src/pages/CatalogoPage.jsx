import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import db from '../data/db.json';
import { categoriasUnicas } from '../core/estadisticas.js';
import { Plato } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ListaPlatos } from '../components/ListaPlatos.jsx';

export function CatalogoPage() {
  useTituloPagina('Catálogo');
  const { estaAutenticado } = useAuth();
  const [searchParams] = useSearchParams();
  const [categoria, setCategoria] = useState(() => searchParams.get('categoria') || '');
  const [texto, setTexto] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const categorias = categoriasUnicas(db.platos);
  const disponibles = db.platos.filter((p) => new Plato(p).estaDisponible).length;
  const query = texto.trim().toLowerCase();

  const platosFiltrados = db.platos.filter((p) => {
    const modelo = new Plato(p);
    if (soloDisponibles && !modelo.estaDisponible) return false;
    if (categoria && p.categoria !== categoria) return false;
    if (!query) return true;
    return modelo.nombre.toLowerCase().includes(query) || modelo.tieneIngrediente(query);
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Catálogo de platos</h2>
          <p className="text-muted-fc small mb-0">
            Menú de la cafetería universitaria · {db.platos.length} platos · {disponibles} disponibles
          </p>
        </div>
        <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--brand-soft)', color: 'var(--brand-ink)' }}>
          {platosFiltrados.length} resultados
        </span>
      </div>

      <div className="row g-4 align-items-start">
        <aside className="col-lg-3">
          <div className="fc-card p-3 fc-sticky-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold small text-uppercase text-muted-fc" style={{ letterSpacing: '0.06em' }}>Filtros</span>
              {(texto || categoria || soloDisponibles) && (
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none text-brand"
                  onClick={() => { setTexto(''); setCategoria(''); setSoloDisponibles(false); }}
                >
                  Limpiar
                </button>
              )}
            </div>

            <input
              type="search"
              className="form-control fc-input mb-3"
              placeholder="🔍 Buscar plato..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />

            <div className="small fw-semibold text-muted-fc mb-2">Categoría</div>
            <div className="d-flex flex-lg-column flex-wrap gap-2 mb-3">
              <button type="button" className={`fc-chip justify-content-between ${!categoria ? 'active' : ''}`} onClick={() => setCategoria('')}>
                <span>Todos</span>
                <span className="fc-chip-count">{db.platos.length}</span>
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`fc-chip justify-content-between ${categoria === cat ? 'active' : ''}`}
                  onClick={() => setCategoria(cat === categoria ? '' : cat)}
                >
                  <span>{cat}</span>
                  <span className="fc-chip-count">{db.platos.filter((p) => p.categoria === cat).length}</span>
                </button>
              ))}
            </div>

            <div className="form-check form-switch pt-2 border-top" style={{ borderColor: 'var(--line)' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="soloDisponibles"
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="soloDisponibles">Solo disponibles</label>
            </div>
          </div>
        </aside>

        <div className="col-lg-9">
          <ListaPlatos platos={platosFiltrados} puedePedir={estaAutenticado} />
        </div>
      </div>
    </div>
  );
}
