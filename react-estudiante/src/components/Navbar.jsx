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
  const codigoEstudiante = usuario?.correo ? usuario.correo.split('@')[0].toUpperCase() : 'U20231234';

  return (
    <nav className="navbar navbar-expand-md navbar-custom sticky-top">
      <div className="container">
        <Link className="d-flex align-items-center gap-2 text-decoration-none text-reset" to="/">
          <span className="brand-icon">🍴</span>
          <span className="fs-5 fw-bold">{marca}</span>
        </Link>

        <div className="d-none d-md-flex mx-auto">
          <div className="nav-pill-container">
            <NavLink className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`} to="/" end>
              Inicio
            </NavLink>
            <NavLink className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`} to="/catalogo">
              Catálogo
            </NavLink>
            {estaAutenticado && (
              <NavLink className={({ isActive }) => `nav-pill-item ${isActive ? 'active' : ''}`} to="/mis-pedidos">
                Mis pedidos
              </NavLink>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={alternarTema}
            title="Alternar tema"
          >
            {esOscuro ? '☀️' : '🌙'}
          </button>

          {estaAutenticado ? (
            <div className="d-flex align-items-center gap-2">
              <div className="user-profile-badge">
                <div className="avatar-circle">{iniciales}</div>
                <div className="d-flex flex-column text-start">
                  <span className="small fw-bold lh-1">{usuario.nombre.split(' ')[0]}</span>
                  <span className="text-body-secondary" style={{ fontSize: '0.68rem' }}>{codigoEstudiante}</span>
                </div>
              </div>
              <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1 small" onClick={manejarSalida}>
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
    </nav>
  );
}
