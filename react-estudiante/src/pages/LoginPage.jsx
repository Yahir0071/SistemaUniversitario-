import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

const HERO_IMG = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80';

export function LoginPage() {
  useTituloPagina('Iniciar Sesión');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const correoRef = useRef(null);

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verClave, setVerClave] = useState(false);
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
    <div className="d-flex justify-content-center py-3">
      <div className="fc-card-lg overflow-hidden w-100" style={{ maxWidth: '880px' }}>
        <div className="row g-0">
          <div
            className="col-md-6 d-none d-md-flex flex-column justify-content-end p-4 text-white"
            style={{
              minHeight: '480px',
              backgroundImage: `linear-gradient(to top, rgba(16,12,8,0.92) 0%, rgba(16,12,8,0.25) 60%, transparent 100%), url('${HERO_IMG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3 className="fw-bold mb-2">Tu almuerzo listo cuando salgas de clase.</h3>
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.82)' }}>
              Ingresa con tu cuenta UTP para reservar platos y seguir el estado de tus pedidos.
            </p>
          </div>

          <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
            <div className="fc-squircle mb-3" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>🍴</div>
            <h2 className="fw-bold mb-1">Iniciar sesión</h2>
            <p className="text-muted-fc small mb-4">Usa tu correo institucional y la contraseña de tu cuenta UTP.</p>

            {error && <div className="alert alert-danger rounded-4 small py-2">{error}</div>}

            <form onSubmit={manejarSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold" htmlFor="correo">Correo institucional</label>
                <input
                  id="correo" ref={correoRef} type="email" className="form-control fc-input"
                  placeholder="u00000000@utp.edu.pe" value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
                <div className="form-text text-muted-fc">Ejemplo: u20231234@utp.edu.pe</div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold" htmlFor="password">Contraseña</label>
                <div className="position-relative">
                  <input
                    id="password" type={verClave ? 'text' : 'password'} className="form-control fc-input pe-5"
                    placeholder="••••••" value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted-fc border-0"
                    onClick={() => setVerClave((v) => !v)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {verClave ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn fc-btn-brand rounded-pill w-100 py-2 mb-3">Iniciar sesión</button>
            </form>

            <div className="p-3 rounded-4 border" style={{ backgroundColor: 'var(--surface-sunken)', borderColor: 'var(--line)' }}>
              <button type="button" className="btn btn-sm fc-btn-outline w-100" onClick={cargarDemo}>
                ℹ️ Usar cuenta demo: Luis Quispe (U20231234)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
