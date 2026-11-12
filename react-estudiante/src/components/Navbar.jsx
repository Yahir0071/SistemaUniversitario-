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
              <>
                <span className="small d-none d-lg-inline text-body-secondary">
                  Hola, <strong>{usuario.nombre}</strong>
                </span>
                <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={manejarSalida}>
                  Salir
                </button>
              </>
            ) : (
              <Link className="btn btn-sm btn-primary rounded-pill px-3" to="/login">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
