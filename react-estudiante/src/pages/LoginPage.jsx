import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { IMAGENES_PLATOS } from '../data/platosImagenes.js';

export function LoginPage() {
  useTituloPagina('Iniciar Sesión');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const correoRef = useRef(null);

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verPassword, setVerPassword] = useState(false);

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
    <div className="py-4">
      <div className="login-split-card mx-auto" style={{ maxWidth: '980px' }}>
        <div className="row g-0">
          <div
            className="col-lg-6 login-food-hero d-none d-lg-flex"
            style={{ backgroundImage: `url(${IMAGENES_PLATOS[1]})` }}
          >
            <div className="login-food-hero-text">
              <h2 className="fw-bold fs-2 mb-2">Tu almuerzo listo cuando salgas de clase.</h2>
              <p className="small mb-0 text-white-50">
                Ingresa con tu cuenta UTP para reservar platos y seguir el estado de tus pedidos.
              </p>
            </div>
          </div>

          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center">
            <div className="mb-4">
              <span className="brand-icon mb-3">🍴</span>
              <h1 className="fw-bold fs-3 mb-1">Iniciar sesión</h1>
              <p className="text-body-secondary small mb-0">
                Usa tu correo institucional y la contraseña de tu cuenta UTP.
              </p>
            </div>

            {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">ⓘ {error}</div>}

            <form onSubmit={manejarSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary-emphasis" htmlFor="correo">
                  Correo institucional
                </label>
                <input
                  id="correo" ref={correoRef} type="email"
                  className="form-control" placeholder="U00000000@utp.edu.pe"
                  value={correo} onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary-emphasis" htmlFor="password">
                  Contraseña
                </label>
                <div className="position-relative">
                  <input
                    id="password" type={verPassword ? 'text' : 'password'}
                    className="form-control pe-5" placeholder="Mínimo 8 caracteres"
                    value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none pe-3"
                    onClick={() => setVerPassword(!verPassword)}
                    tabIndex="-1"
                  >
                    {verPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold fs-6 mb-3">
                Iniciar sesión
              </button>

              <div className="proto-hint-box" onClick={cargarDemo} role="button" title="Clic para rellenar">
                <span>ⓘ <strong>Prototipo:</strong> ingresa con <u>U20231234@utp.edu.pe</u> y cualquier contraseña de 8 caracteres para ver pedidos de ejemplo. Otros códigos empiezan sin pedidos.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
