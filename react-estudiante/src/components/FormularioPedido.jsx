import { useState } from 'react';
import { Pedido } from '../core/modelos.js';
import { validarFormularioPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

const FECHAS = [
  { label: 'Hoy', sub: '12 nov', val: '2026-11-12' },
  { label: 'Mañana', sub: '13 nov', val: '2026-11-13' },
  { label: 'Sáb', sub: '14 nov', val: '2026-11-14' },
  { label: 'Dom', sub: 'Cerrado', val: '2026-11-15', disabled: true },
  { label: 'Lun', sub: '16 nov', val: '2026-11-16' },
  { label: 'Mar', sub: '17 nov', val: '2026-11-17' },
];
const HORAS = ['12:00', '12:30', '13:00', '13:30', '14:00'];

export function FormularioPedido({ platos, pedidosUsuario, usuarioId, platoInicialId = '', onGuardar }) {
  const [platoId, setPlatoId] = useState(platoInicialId ? String(platoInicialId) : String(platos[0]?.id || '1'));
  const [fecha, setFecha] = useState('2026-11-12');
  const [hora, setHora] = useState('12:30');
  const [cantidad, setCantidad] = useState(1);
  const [cambiando, setCambiando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const plato = platos.find((p) => Number(p.id) === Number(platoId)) || platos[0];
  const total = plato ? new Pedido({ cantidad, precioUnitario: plato.precio }).precioTotal : 0;
  const fechaObj = FECHAS.find((f) => f.val === fecha);

  const manejarEnvio = (e) => {
    e.preventDefault();
    const { errores, valido } = validarFormularioPedido({ platoId, fecha, hora, cantidad, notas: '' }, platos, pedidosUsuario, usuarioId);
    if (!valido) { setError(Object.values(errores)[0]); return; }
    const pedido = onGuardar({ platoId: Number(platoId), fecha, hora, cantidad, precioUnitario: plato.precio, notas: '' });
    setExito(`¡Pedido ${pedido.codigo} registrado con éxito!`);
    setError('');
  };

  return (
    <form onSubmit={manejarEnvio} className="row g-4">
      <div className="col-lg-7">
        {error && <div className="alert alert-danger rounded-4 py-2 small mb-3">ⓘ {error}</div>}
        {exito && <div className="alert alert-success rounded-4 py-2 small mb-3">✓ {exito}</div>}

        <div className="nuevo-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-secondary text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Plato elegido</span>
            <button type="button" className="btn btn-link text-decoration-none p-0 small fw-semibold" style={{ color: 'var(--fc-primary)' }} onClick={() => setCambiando(!cambiando)}>
              {cambiando ? 'Listo' : 'Cambiar'}
            </button>
          </div>
          {cambiando ? (
            <select className="form-select" value={platoId} onChange={(e) => { setPlatoId(e.target.value); setCambiando(false); }}>
              {platos.map((p) => (<option key={p.id} value={p.id}>{p.nombre} — S/ {p.precio.toFixed(2)}</option>))}
            </select>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <img src={obtenerImagenPlato(plato.id)} alt="" className="rounded-3 object-fit-cover" style={{ width: '64px', height: '64px' }} />
              <div>
                <div className="fw-bold">{plato.nombre}</div>
                <div className="small text-secondary"><span className="text-success">●</span> Disponible · {plato.categoria}</div>
              </div>
            </div>
          )}
        </div>

        <div className="nuevo-card d-flex justify-content-between align-items-center">
          <div><div className="fw-semibold">Cantidad</div><div className="small text-secondary">Máximo 5 por pedido</div></div>
          <div className="counter-pill">
            <button type="button" className="counter-btn" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1}>−</button>
            <span className="px-3 fw-bold">{cantidad}</span>
            <button type="button" className="counter-btn" onClick={() => setCantidad((c) => Math.min(5, c + 1))} disabled={cantidad >= 5}>+</button>
          </div>
        </div>

        <div className="nuevo-card">
          <div className="fw-semibold mb-2">📅 Fecha de recojo</div>
          <div className="date-pill-grid">
            {FECHAS.map((f) => (
              <div key={f.val} className={`date-chip ${fecha === f.val ? 'active' : ''} ${f.disabled ? 'disabled' : ''}`}
                onClick={() => !f.disabled && setFecha(f.val)} role="button">
                <div className="fw-bold small">{f.label}</div>
                <div className="small text-secondary-subtle" style={{ fontSize: '0.72rem' }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="nuevo-card">
          <div className="fw-semibold mb-2">🕒 Hora de recojo</div>
          <div className="d-flex flex-wrap gap-2">
            {HORAS.map((h) => (
              <button key={h} type="button" className={`btn btn-sm rounded-pill px-3 ${hora === h ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setHora(h)}>
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="card card-plato shadow-sm p-4 sticky-top" style={{ top: '90px' }}>
          <img src={obtenerImagenPlato(plato.id)} alt="" className="rounded-4 w-100 object-fit-cover mb-3" style={{ height: '180px' }} />
          <div className="small text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem' }}>Resumen del pedido</div>
          <h3 className="h5 fw-bold mb-3">{plato.nombre}</h3>
          <div className="d-flex justify-content-between small text-secondary mb-2"><span>Precio unitario</span><span>S/ {plato.precio.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between small text-secondary mb-2"><span>Cantidad</span><span>x {cantidad}</span></div>
          <div className="d-flex justify-content-between small text-secondary mb-3"><span>Recojo</span><span>{fechaObj?.label || fecha} · {hora}</span></div>
          <div className="pt-3 border-top d-flex justify-content-between align-items-center mb-4">
            <span className="fw-bold">Total</span><span className="fs-3 fw-bold">S/ {total.toFixed(2)}</span>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold">Confirmar pedido</button>
          <div className="text-center text-secondary small mt-2" style={{ fontSize: '0.74rem' }}>Podrás cancelarlo mientras esté pendiente.</div>
        </div>
      </div>
    </form>
  );
}
