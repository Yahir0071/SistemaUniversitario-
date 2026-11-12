import { useEffect, useRef, useState } from 'react';
import { Pedido } from '../core/modelos.js';
import { obtenerFechaHoy, validarFormularioPedido } from '../utils/pedidoValidation.js';
import { CampoForm } from './CampoForm.jsx';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

const estadoInicial = (platoId = '') => ({
  platoId: platoId ? String(platoId) : '',
  fecha: obtenerFechaHoy(),
  hora: '12:30',
  cantidad: 1,
  notas: '',
});

export function FormularioPedido({ platos, pedidosUsuario, usuarioId, platoInicialId = '', onGuardar }) {
  const [form, setForm] = useState(() => estadoInicial(platoInicialId));
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');
  const primerCampoRef = useRef(null);

  useEffect(() => { primerCampoRef.current?.focus(); }, []);

  const platoActual = platos.find((p) => Number(p.id) === Number(form.platoId));
  const totalEstimado = platoActual
    ? new Pedido({ cantidad: Number(form.cantidad) || 0, precioUnitario: platoActual.precio }).precioTotal
    : 0;

  const actualizar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined, general: undefined }));
    if (exito) setExito('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const { errores: errs, valido } = validarFormularioPedido(form, platos, pedidosUsuario, usuarioId);
    if (!valido) { setErrores(errs); return; }

    const creado = onGuardar({
      platoId: Number(form.platoId),
      fecha: form.fecha,
      hora: form.hora,
      cantidad: Number(form.cantidad),
      precioUnitario: platoActual.precio,
      notas: form.notas.trim(),
    });

    setErrores({});
    setExito(`¡Pedido ${creado.codigo} registrado exitosamente!`);
    setForm(estadoInicial(''));
    primerCampoRef.current?.focus();
  };

  return (
    <form onSubmit={manejarEnvio} noValidate className="card card-plato p-4 col-lg-8 shadow-lg border-0">
      {exito && <div className="alert alert-success rounded-3 small py-2 mb-3">✓ {exito}</div>}
      {errores.general && <div className="alert alert-danger rounded-3 small py-2 mb-3">{errores.general}</div>}

      <CampoForm id="platoId" label="Plato del menú" error={errores.platoId}>
        <div className="d-flex gap-3 align-items-center mb-2">
          {platoActual && (
            <img src={obtenerImagenPlato(platoActual.id)} alt="" className="order-thumb flex-shrink-0" style={{ width: '48px', height: '48px' }} />
          )}
          <select
            id="platoId" ref={primerCampoRef} className={`form-select ${errores.platoId ? 'is-invalid' : ''}`}
            value={form.platoId} onChange={(e) => actualizar('platoId', e.target.value)}
          >
            <option value="">Selecciona qué deseas ordenar...</option>
            {platos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} — S/ {p.precio.toFixed(2)} {p.estado === 'agotado' ? '(Agotado)' : ''}</option>
            ))}
          </select>
        </div>
      </CampoForm>

      <div className="row g-3 mb-3">
        <CampoForm id="fecha" label="Fecha de recojo" error={errores.fecha} className="col-sm-5">
          <input id="fecha" type="date" className={`form-control ${errores.fecha ? 'is-invalid' : ''}`} value={form.fecha} onChange={(e) => actualizar('fecha', e.target.value)} />
        </CampoForm>
        <CampoForm id="hora" label="Hora de recojo" error={errores.hora} className="col-sm-4">
          <input id="hora" type="time" className={`form-control ${errores.hora ? 'is-invalid' : ''}`} value={form.hora} onChange={(e) => actualizar('hora', e.target.value)} />
        </CampoForm>
        <CampoForm id="cantidad" label="Cantidad" error={errores.cantidad} className="col-sm-3">
          <input id="cantidad" type="number" min="1" max="20" className={`form-control ${errores.cantidad ? 'is-invalid' : ''}`} value={form.cantidad} onChange={(e) => actualizar('cantidad', e.target.value)} />
        </CampoForm>
      </div>

      <CampoForm id="notas" label="Instrucciones especiales (opcional)">
        <input id="notas" type="text" className="form-control" placeholder="Ej. Sin cebolla, tártara aparte, para llevar..." value={form.notas} onChange={(e) => actualizar('notas', e.target.value)} />
      </CampoForm>

      <div className="p-3 rounded-4 mb-4 border d-flex justify-content-between align-items-center" style={{ background: 'var(--fc-chip-bg)' }}>
        <div>
          <span className="small text-body-secondary d-block">Resumen</span>
          <span className="fw-semibold small">{platoActual ? `${form.cantidad}x ${platoActual.nombre}` : 'Ningún plato seleccionado'}</span>
        </div>
        <div className="text-end">
          <span className="small text-body-secondary d-block">Total estimado</span>
          <span className="fs-4 fw-bold text-success">S/ {totalEstimado.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 align-self-start fw-semibold shadow-sm">
        Confirmar Pedido
      </button>
    </form>
  );
}
