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
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🍔 {marca}
        </Link>

        <div className="d-flex flex-wrap align-items-center gap-3 flex-grow-1 justify-content-between mt-2 mt-md-0">
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalogo">
                Catálogo
              </NavLink>
            </li>
            {estaAutenticado && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mis-pedidos">
                    Mis Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/nuevo-pedido">
                    Nuevo Pedido
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={alternarTema}
              title="Cambiar tema claro/oscuro"
            >
              {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
            </button>

            {estaAutenticado ? (
              <>
                <span className="text-light small d-none d-lg-inline">
                  Hola, <strong>{usuario.nombre}</strong>
                </span>
                <button type="button" className="btn btn-sm btn-outline-warning" onClick={manejarSalida}>
                  Salir
                </button>
              </>
            ) : (
              <Link className="btn btn-sm btn-primary" to="/login">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
