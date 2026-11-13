import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const obtenerIniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || 'FC';

export function Navbar({ marca = 'FoodCampus' }) {
  const { usuario, estaAutenticado, logout } = useAuth();
  const { esOscuro, alternarTema } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const manejarSalida = () => {
    setMenuAbierto(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="fc-navbar d-flex align-items-center py-2">
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
        <Link className="d-flex align-items-center gap-2 text-decoration-none" to="/">
          <span className="fc-squircle" aria-hidden="true">🍴</span>
          <span className="fs-5 fw-bold" style={{ color: 'var(--ink)' }}>
            {marca.startsWith('Food') ? <>Food<span className="text-brand">{marca.slice(4)}</span></> : marca}
          </span>
        </Link>

        <nav className="fc-nav-pill-group order-3 order-lg-2 mx-auto mx-lg-0">
          <NavLink className="fc-nav-link" to="/" end>Inicio</NavLink>
          <NavLink className="fc-nav-link" to="/catalogo">Catálogo</NavLink>
          {estaAutenticado && <NavLink className="fc-nav-link" to="/mis-pedidos">Mis pedidos</NavLink>}
        </nav>

        <div className="d-flex align-items-center gap-2 order-2 order-lg-3 position-relative">
          <button
            type="button"
            className="fc-theme-switch border-0"
            onClick={alternarTema}
            title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema"
          >
            <span className={`fc-theme-btn ${!esOscuro ? 'active' : ''}`}>☀️</span>
            <span className={`fc-theme-btn ${esOscuro ? 'active' : ''}`}>🌙</span>
          </button>

          {estaAutenticado ? (
            <>
              <button
                type="button"
                className="fc-user-pill"
                onClick={() => setMenuAbierto((v) => !v)}
              >
                <span className="fc-avatar">{obtenerIniciales(usuario.nombre)}</span>
                <span className="small fw-semibold d-none d-sm-inline">{usuario.nombre.split(' ')[0]}</span>
                <span className="small text-muted-fc d-none d-md-inline">{usuario.codigo}</span>
                <span className="small text-muted-fc">▾</span>
              </button>

              {menuAbierto && (
                <div className="fc-dropdown p-3">
                  <div className="pb-2 mb-2 border-bottom" style={{ borderColor: 'var(--line)' }}>
                    <div className="fw-bold small">{usuario.nombre}</div>
                    <div className="text-muted-fc" style={{ fontSize: '0.78rem' }}>{usuario.codigo} · {usuario.correo}</div>
                  </div>
                  <Link
                    className="btn btn-sm w-100 text-start mb-1 fc-btn-outline"
                    to="/mis-pedidos"
                    onClick={() => setMenuAbierto(false)}
                  >
                    🛍️ Mis pedidos
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm w-100 text-start text-danger fw-semibold"
                    onClick={manejarSalida}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link className="btn btn-sm fc-btn-brand rounded-pill px-3 py-2" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
