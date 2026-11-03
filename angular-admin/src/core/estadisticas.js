// map / filter / reduce, Map y Set (S2, S4, S5)
import { Reserva } from './modelos.js';

// reduce con valor inicial objeto: el acumulador es un contador por estado
export const reservasPorEstado = (reservas) =>
  reservas.reduce(
    (acc, r) => ({ ...acc, [r.estado]: (acc[r.estado] ?? 0) + 1 }),
    { pendiente: 0, aprobada: 0, rechazada: 0 }
  );

// Map laboratorioId -> horas ocupadas (no cuenta las rechazadas)
export const ocupacionPorLaboratorio = (reservas) => {
  const mapa = new Map();
  reservas
    .filter((r) => r.estado !== 'rechazada')
    .forEach((r) => {
      const horas = new Reserva(r).duracionHoras();
      mapa.set(r.laboratorioId, (mapa.get(r.laboratorioId) ?? 0) + horas);
    });
  return mapa;
};

// Set elimina duplicados; spread lo vuelve arreglo
export const sedesUnicas = (laboratorios) => [...new Set(laboratorios.map((l) => l.sede))];

// Ranking: cuenta con Map y ordena con sort
export const rankingLaboratorios = (reservas) => {
  const conteo = new Map();
  for (const r of reservas) conteo.set(r.laboratorioId, (conteo.get(r.laboratorioId) ?? 0) + 1);
  return [...conteo]
    .map(([laboratorioId, total]) => ({ laboratorioId, total }))
    .sort((a, b) => b.total - a.total || a.laboratorioId - b.laboratorioId);
};

// Closure: `n` queda privado y persiste entre llamadas
export const crearGeneradorCodigos = (prefijo = 'RES', ultimo = 0) => {
  let n = ultimo;
  return () => `${prefijo}-${String(++n).padStart(4, '0')}`;
};
