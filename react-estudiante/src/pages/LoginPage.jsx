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
    <div className="row justify-content-center py-5">
      <div className="col-md-6 col-lg-5 col-xl-4">
        <div className="card card-plato shadow-lg border-0 p-4 p-md-5">
          <div className="text-center mb-4">
            <span className="brand-icon mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>🍴</span>
            <h2 className="fw-bold fs-4 mb-1">Acceso Estudiante</h2>
            <p className="text-body-secondary small mb-0">
              Ingresa con tu correo institucional UTP para gestionar tus órdenes.
            </p>
          </div>

          {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">{error}</div>}

          <form onSubmit={manejarSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-uppercase text-body-secondary" htmlFor="correo">
                Correo Institucional
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

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary rounded-pill py-2 fw-semibold">
                Iniciar Sesión
              </button>
            </div>

            <div className="pt-3 border-top text-center">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 w-100"
                onClick={cargarDemo}
              >
                ⚡ Ingresar con cuenta demo (Luis Quispe)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
