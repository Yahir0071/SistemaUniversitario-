import { useState } from 'react';

const DIAS_SEM = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const FRANJAS = [
  { id: 'desayuno', label: 'MAÑANA (Desayuno)', horas: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
  { id: 'almuerzo', label: 'MEDIODÍA (Almuerzo)', horas: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
  { id: 'tarde', label: 'TARDE / CAFÉ', horas: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'] },
];
const TURNOS_POR_CAT = {
  Desayunos: ['desayuno', 'tarde'],
  Almuerzos: ['almuerzo'],
  Saludable: ['almuerzo', 'tarde'],
};

const aIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function construirProximosDias() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const cerrado = d.getDay() === 0;
    return {
      valor: aIso(d),
      titulo: i === 0 ? `${DIAS_SEM[d.getDay()]} · Hoy` : DIAS_SEM[d.getDay()],
      subtitulo: cerrado ? 'Cerrado' : `${d.getDate()} ${MESES[d.getMonth()]}`,
      cerrado,
    };
  });
}

function esHoraPasada(fecha, hhmm) {
  const ahora = new Date();
  if (fecha !== aIso(ahora)) return false;
  const [hh, mm] = hhmm.split(':').map(Number);
  return hh * 60 + mm < ahora.getHours() * 60 + ahora.getMinutes() + 30;
}

export function SelectorFranjas({ fecha, hora, categoria = '', errores, onChange }) {
  const [manualFecha, setManualFecha] = useState(false);
  const [manualHora, setManualHora] = useState(false);
  const dias = construirProximosDias();
  const turnosPermitidos = TURNOS_POR_CAT[categoria] || ['desayuno', 'almuerzo', 'tarde'];

  return (
    <>
      <div className="fc-card p-4 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">📅 Fecha de recojo</span>
          <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none text-muted-fc" onClick={() => setManualFecha((v) => !v)}>
            {manualFecha ? 'Ver calendario' : 'Otra fecha'}
          </button>
        </div>

        <div className="fc-day-grid">
          {dias.map((d) => (
            <button key={d.valor} type="button" disabled={d.cerrado} className={`fc-day-card ${fecha === d.valor ? 'active' : ''}`} onClick={() => onChange('fecha', d.valor)}>
              <div className="small fw-semibold">{d.titulo}</div>
              <div className="text-muted-fc" style={{ fontSize: '0.75rem' }}>{d.subtitulo}</div>
            </button>
          ))}
        </div>

        {manualFecha && <input id="fecha" type="date" className={`form-control fc-input mt-3 ${errores.fecha ? 'is-invalid' : ''}`} value={fecha} onChange={(e) => onChange('fecha', e.target.value)} />}
        {errores.fecha && <div className="text-danger small mt-2">{errores.fecha}</div>}
      </div>

      <div className="fc-card p-4 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">🕒 Hora de recojo</span>
          <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none text-muted-fc" onClick={() => setManualHora((v) => !v)}>
            {manualHora ? 'Ocultar hora manual' : 'Hora manual'}
          </button>
        </div>

        {!fecha ? (
          <div className="p-3 rounded-4 text-muted-fc small" style={{ backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--line)' }}>
            Elige primero la fecha para ver los horarios disponibles.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {FRANJAS.map((f) => {
              const habilitada = turnosPermitidos.includes(f.id);
              return (
                <div key={f.id} style={{ opacity: habilitada ? 1 : 0.45 }}>
                  <div className="text-muted-fc fw-semibold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                    <span>{f.label}</span>
                    {!habilitada && <span className="badge rounded-pill text-bg-secondary">Fuera de turno para {categoria}</span>}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {f.horas.map((h) => (
                      <button key={h} type="button" disabled={!habilitada || esHoraPasada(fecha, h)} className={`fc-slot-btn ${hora === h ? 'active' : ''}`} onClick={() => onChange('hora', h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="small text-muted-fc">Los horarios tachados ya pasaron, no dejan 30 min de preparación o no corresponden al turno del plato.</div>
          </div>
        )}

        {manualHora && <input id="hora" type="time" className={`form-control fc-input mt-3 ${errores.hora ? 'is-invalid' : ''}`} value={hora} onChange={(e) => onChange('hora', e.target.value)} />}
        {errores.hora && <div className="text-danger small mt-2">{errores.hora}</div>}
      </div>
    </>
  );
}
