import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export function Navbar({ marca = 'FoodCampus' }) {
  const { usuario, estaAutenticado, logout } = useAuth();
  const { esOscuro, alternarTema } = useTheme();
  const navigate = useNavigate();

  const manejarSalida = () => {
    logout();
    navigate('/login');
  };

  const iniciales = usuario?.nombre ? usuario.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <nav className="navbar navbar-expand-md navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-decoration-none" to="/">
          <span className="brand-icon">🍴</span>
          <span className="fs-5">
            {marca.startsWith('Food') ? (
              <>Food<span style={{ color: 'var(--fc-primary)' }}>{marca.slice(4)}</span></>
            ) : (
              marca
            )}
          </span>
        </Link>

        <div className="d-flex flex-wrap align-items-center gap-3 flex-grow-1 justify-content-between mt-2 mt-md-0">
          <ul className="navbar-nav flex-row gap-2 gap-md-3">
            <li className="nav-item">
              <NavLink className="nav-link px-2 fw-medium" to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-2 fw-medium" to="/catalogo">
                Catálogo
              </NavLink>
            </li>
            {estaAutenticado && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link px-2 fw-medium" to="/mis-pedidos">
                    Mis Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-2 fw-medium" to="/nuevo-pedido">
                    Nuevo Pedido
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={alternarTema}
              title="Alternar tema claro/oscuro"
            >
              {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
            </button>

            {estaAutenticado ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-none d-lg-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-body-tertiary border">
                  <span
                    className="badge rounded-circle text-white d-flex align-items-center justify-content-center"
                    style={{ width: '22px', height: '22px', fontSize: '0.7rem', background: 'var(--fc-primary)' }}
                  >
                    {iniciales}
                  </span>
                  <span className="small fw-semibold pe-1">{usuario.nombre}</span>
                </div>
                <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={manejarSalida}>
                  Salir
                </button>
              </div>
            ) : (
              <Link className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold" to="/login">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
