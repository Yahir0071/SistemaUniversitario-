// Validadores con expresiones regulares (S3)
export const esCorreoUTP = (correo) => /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(correo);
export const esCodigoAlumno = (codigo) => /^U\d{8}$/.test(codigo);
export const esHora = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
export const esFecha = (fecha) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(fecha)) return false;
  const d = new Date(`${fecha}T00:00:00Z`); // descarta fechas como 2026-02-31
  return d.toISOString().slice(0, 10) === fecha;
};
export const esCodigoReserva = (codigo) => /^RES-\d{4}$/.test(codigo);

const aMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function validarUsuario(u = {}) {
  const errores = [];
  if (!u.nombre?.trim()) errores.push('El nombre es obligatorio');
  if (!esCorreoUTP(u.correo)) errores.push(`Correo inválido: "${u.correo}" (debe terminar en @utp.edu.pe)`);
  if (u.rol === 'estudiante' && !esCodigoAlumno(u.codigo))
    errores.push(`Código inválido: "${u.codigo}" (formato U + 8 dígitos)`);
  if (!['estudiante', 'admin'].includes(u.rol)) errores.push(`Rol inválido: "${u.rol}"`);
  return errores;
}

export function validarLaboratorio(l = {}) {
  const errores = [];
  if (!l.nombre?.trim()) errores.push('El nombre es obligatorio');
  if (!l.sede?.trim()) errores.push('La sede es obligatoria');
  if (!Number.isInteger(l.capacidad) || l.capacidad < 1 || l.capacidad > 60)
    errores.push(`Capacidad inválida: ${l.capacidad} (debe estar entre 1 y 60)`);
  if (!Array.isArray(l.equipos)) errores.push('Los equipos deben ser un arreglo de cadenas');
  if (!['disponible', 'mantenimiento'].includes(l.estado)) errores.push(`Estado inválido: "${l.estado}"`);
  return errores;
}

export function validarReserva(r = {}) {
  const errores = [];
  if (!esFecha(r.fecha)) errores.push(`Fecha inválida: "${r.fecha}" (use AAAA-MM-DD)`);
  if (!esHora(r.horaInicio)) errores.push(`Hora de inicio inválida: "${r.horaInicio}" (use HH:mm)`);
  if (!esHora(r.horaFin)) errores.push(`Hora de fin inválida: "${r.horaFin}" (use HH:mm)`);
  if (esHora(r.horaInicio) && esHora(r.horaFin) && aMin(r.horaFin) <= aMin(r.horaInicio))
    errores.push(`La hora de fin (${r.horaFin}) debe ser mayor que la de inicio (${r.horaInicio})`);
  if (!r.laboratorioId) errores.push('Falta el laboratorio');
  if (!r.usuarioId) errores.push('Falta el usuario');
  return errores;
}
