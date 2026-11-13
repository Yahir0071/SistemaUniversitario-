import { useEffect, useRef, useState } from 'react';
import { Pedido, Plato } from '../core/modelos.js';
import { validarFormularioPedido } from '../utils/pedidoValidation.js';
import { BadgeEstado } from './BadgeEstado.jsx';
import { SelectorFranjas } from './SelectorFranjas.jsx';
import { ResumenPedidoCard } from './ResumenPedidoCard.jsx';
import { TicketConfirmado } from './TicketConfirmado.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

const estadoInicial = (platos = [], platoId = '', cantidad = 1) => {
  const primeroDisponible = platos.find((p) => new Plato(p).estaDisponible)?.id;
  return {
    platoId: platoId ? String(platoId) : (primeroDisponible ? String(primeroDisponible) : ''),
    fecha: '',
    hora: '',
    cantidad: Number(cantidad) || 1,
    notas: '',
  };
};

export function FormularioPedido({ platos, pedidosUsuario, usuarioId, platoInicialId = '', cantidadInicial = 1, onGuardar }) {
  const [form, setForm] = useState(() => estadoInicial(platos, platoInicialId, cantidadInicial));
  const [errores, setErrores] = useState({});
  const [confirmado, setConfirmado] = useState(null);
  const [cambiarPlato, setCambiarPlato] = useState(false);
  const primerCampoRef = useRef(null);

  useEffect(() => { primerCampoRef.current?.focus(); }, []);

  const platoActual = platos.find((p) => Number(p.id) === Number(form.platoId));
  const totalEstimado = platoActual ? new Pedido({ cantidad: Number(form.cantidad) || 0, precioUnitario: platoActual.precio }).precioTotal : 0;

  const actualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined, general: undefined }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const { errores: errs, valido } = validarFormularioPedido(form, platos, pedidosUsuario, usuarioId);
    if (!valido) { setErrores(errs); return; }
    const creado = onGuardar({
      platoId: Number(form.platoId), fecha: form.fecha, hora: form.hora,
      cantidad: Number(form.cantidad), precioUnitario: platoActual.precio, notas: form.notas.trim(),
    });
    setConfirmado({ pedido: creado, plato: platoActual, nombrePlato: platoActual.nombre });
    setErrores({});
    setForm(estadoInicial(platos, '', 1));
    setCambiarPlato(false);
  };

  if (confirmado) {
    return <TicketConfirmado pedido={confirmado.pedido} plato={confirmado.plato} nombrePlato={confirmado.nombrePlato} onNuevo={() => setConfirmado(null)} />;
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="row g-4 align-items-start">
      <div className="col-lg-8">
        {errores.general && <div className="alert alert-danger rounded-4 mb-3">{errores.general}</div>}

        <div className="fc-card p-4 mb-3">
          {platoActual && (
            <div className="d-flex justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src={obtenerImagenPlato(platoActual.id, platoActual.imagen)} alt="" className="fc-thumb-sm" style={{ width: '58px', height: '58px' }} />
                <div>
                  <div className="text-uppercase text-muted-fc fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>Plato elegido</div>
                  <div className="fw-bold">{platoActual.nombre}</div>
                  <div className="d-flex align-items-center gap-2 mt-1 small text-muted-fc">
                    <BadgeEstado estado={platoActual.estado} /> <span>{platoActual.categoria}</span>
                  </div>
                </div>
              </div>
              <button type="button" className="btn btn-link btn-sm text-brand text-decoration-none fw-semibold" onClick={() => { setCambiarPlato((v) => !v); setTimeout(() => primerCampoRef.current?.focus(), 0); }}>
                {cambiarPlato ? 'Listo' : 'Cambiar'}
              </button>
            </div>
          )}

          {(cambiarPlato || !platoActual) && (
            <select
              id="platoId" ref={primerCampoRef}
              className={`form-select fc-input ${platoActual ? 'mt-3' : ''} ${errores.platoId ? 'is-invalid' : ''}`}
              value={form.platoId} onChange={(e) => { actualizar('platoId', e.target.value); setCambiarPlato(false); }}
            >
              <option value="">-- Selecciona un plato disponible --</option>
              {platos.map((p) => <option key={p.id} value={p.id} disabled={!new Plato(p).estaDisponible}>{p.nombre} — S/ {p.precio.toFixed(2)} ({p.estado})</option>)}
            </select>
          )}
          {errores.platoId && <div className="text-danger small mt-2">{errores.platoId}</div>}
        </div>

        <div className="fc-card p-4 mb-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold">Cantidad</div>
            <div className="small text-muted-fc">Máximo 20 por pedido</div>
          </div>
          <div className="fc-stepper">
            <button type="button" className="fc-stepper-btn" onClick={() => actualizar('cantidad', Math.max(1, Number(form.cantidad) - 1))}>-</button>
            <span className="fw-bold px-2">{form.cantidad}</span>
            <button type="button" className="fc-stepper-btn" onClick={() => actualizar('cantidad', Math.min(20, Number(form.cantidad) + 1))}>+</button>
          </div>
        </div>

        <SelectorFranjas fecha={form.fecha} hora={form.hora} errores={errores} onChange={actualizar} />

        <div className="fc-card p-4">
          <label htmlFor="notas" className="form-label fw-semibold small mb-2">Notas adicionales (opcional)</label>
          <textarea id="notas" rows="2" className="form-control fc-input" placeholder="Ej. Sin ají, para llevar, poco arroz..." value={form.notas} onChange={(e) => actualizar('notas', e.target.value)} />
        </div>
      </div>

      <div className="col-lg-4">
        <ResumenPedidoCard platoActual={platoActual} cantidad={form.cantidad} fecha={form.fecha} hora={form.hora} totalEstimado={totalEstimado} />
      </div>
    </form>
  );
}
