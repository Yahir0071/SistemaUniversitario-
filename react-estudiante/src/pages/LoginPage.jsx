import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export function LoginPage() {
  useTituloPagina('Iniciar Sesión');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const correoRef = useRef(null);

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { correoRef.current?.focus(); }, []);
  const destino = location.state?.from || '/catalogo';

  const manejarSubmit = (e) => {
    e.preventDefault();
    const resultado = login(correo, password);
    if (!resultado.ok) { setError(resultado.error); return; }
    navigate(destino, { replace: true });
  };

  const cargarDemo = () => {
    setCorreo('u20231234@utp.edu.pe');
    setPassword('est123');
    setError('');
  };

  return (
    <div className="login-wrapper py-4">
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="card card-login p-4 p-md-5">
          <div className="text-center mb-4">
            <span className="brand-icon mx-auto mb-3" style={{ width: '52px', height: '52px', fontSize: '1.6rem' }}>🍴</span>
            <div className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-body-tertiary border mb-2 small fw-semibold">
              <span className="text-success">●</span> Portal Estudiantil
            </div>
            <h2 className="fw-bold fs-3 mb-1">Acceso FoodCampus</h2>
            <p className="text-body-secondary small mb-0">
              Ingresa con tu correo institucional UTP para gestionar tus órdenes.
            </p>
          </div>

          {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">{error}</div>}

          <form onSubmit={manejarSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-uppercase text-body-secondary d-flex justify-content-between" htmlFor="correo">
                <span>Correo Institucional</span>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>@utp.edu.pe</span>
              </label>
              <input
                id="correo" ref={correoRef} type="email"
                className="form-control" placeholder="u20231234@utp.edu.pe"
                value={correo} onChange={(e) => { setCorreo(e.target.value); setError(''); }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-uppercase text-body-secondary" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password" type="password"
                className="form-control" placeholder="••••••••"
                value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
            </div>

            <button type="submit" className="btn btn-primary rounded-pill py-2 w-100 fw-semibold mb-4">
              Iniciar Sesión →
            </button>

            <div className="demo-account-card mb-3" onClick={cargarDemo} role="button">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-circle text-white d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '0.75rem', background: 'var(--fc-primary)' }}>
                    LQ
                  </span>
                  <div className="text-start">
                    <div className="small fw-bold">Luis Quispe · Demo</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>u20231234@utp.edu.pe</div>
                  </div>
                </div>
                <span className="badge rounded-pill text-white px-2 py-1" style={{ fontSize: '0.7rem', background: 'var(--fc-primary)' }}>
                  Auto-rellenar ⚡
                </span>
              </div>
            </div>

            <div className="text-center text-muted small" style={{ fontSize: '0.75rem' }}>
              🔒 Acceso seguro con validación institucional FoodCampus
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
