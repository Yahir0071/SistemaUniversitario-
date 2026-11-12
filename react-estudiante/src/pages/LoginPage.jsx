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

  useEffect(() => {
    correoRef.current?.focus();
  }, []);

  const destino = location.state?.from || '/catalogo';

  const manejarSubmit = (e) => {
    e.preventDefault();
    const resultado = login(correo, password);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    navigate(destino, { replace: true });
  };

  const cargarDemo = () => {
    setCorreo('u20231234@utp.edu.pe');
    setPassword('est123');
    setError('');
  };

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-6 col-lg-5">
        <div className="card card-plato shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-icon">🍴</span>
              <h3 className="card-title fw-bold m-0">Iniciar Sesión</h3>
            </div>
            <p className="text-body-secondary small mb-4">
              Accede con tu cuenta institucional <code>@utp.edu.pe</code> para registrar pedidos.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={manejarSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="correo">Correo institucional</label>
                <input
                  id="correo"
                  ref={correoRef}
                  type="email"
                  className="form-control rounded-pill px-3"
                  placeholder="u20231234@utp.edu.pe"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  className="form-control rounded-pill px-3"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary rounded-pill py-2">
                  Ingresar al portal
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-pill btn-sm" onClick={cargarDemo}>
                  Autocompletar cuenta demo (Luis Quispe)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
