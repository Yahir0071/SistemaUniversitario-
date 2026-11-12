// Validadores con expresiones regulares para FoodCampus (S3)
export const esCorreoUTP = (correo) => /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(correo);
export const esCodigoAlumno = (codigo) => /^U\d{8}$/.test(codigo);
export const esHora = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
export const esFecha = (fecha) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(fecha)) return false;
  const d = new Date(`${fecha}T00:00:00Z`);
  return d.toISOString().slice(0, 10) === fecha;
};
export const esCodigoPedido = (codigo) => /^PED-\d{4}$/.test(codigo);

export function validarUsuario(u = {}) {
  const errores = [];
  if (!u.nombre?.trim()) errores.push('El nombre es obligatorio');
  if (!esCorreoUTP(u.correo)) errores.push(`Correo inválido: "${u.correo}" (debe terminar en @utp.edu.pe)`);
  if (u.rol === 'estudiante' && !esCodigoAlumno(u.codigo))
    errores.push(`Código inválido: "${u.codigo}" (formato U + 8 dígitos)`);
  if (!['estudiante', 'admin'].includes(u.rol)) errores.push(`Rol inválido: "${u.rol}"`);
  return errores;
}

export function validarPlato(p = {}) {
  const errores = [];
  if (!p.nombre?.trim()) errores.push('El nombre del plato es obligatorio');
  if (!p.categoria?.trim()) errores.push('La categoría es obligatoria');
  if (typeof p.precio !== 'number' || isNaN(p.precio) || p.precio <= 0 || p.precio > 100)
    errores.push(`Precio inválido: S/ ${p.precio} (debe ser mayor a 0 y hasta 100)`);
  if (!Array.isArray(p.ingredientes)) errores.push('Los ingredientes deben ser un arreglo de cadenas');
  if (!['disponible', 'agotado'].includes(p.estado)) errores.push(`Estado inválido: "${p.estado}"`);
  return errores;
}

export function validarPedido(ped = {}) {
  const errores = [];
  if (!esFecha(ped.fecha)) errores.push(`Fecha inválida: "${ped.fecha}" (use AAAA-MM-DD)`);
  if (!Number.isInteger(ped.cantidad) || ped.cantidad < 1 || ped.cantidad > 20)
    errores.push(`Cantidad inválida: ${ped.cantidad} (debe ser un entero entre 1 y 20)`);
  if (typeof ped.precioUnitario !== 'number' || ped.precioUnitario <= 0)
    errores.push(`Precio unitario inválido: S/ ${ped.precioUnitario}`);
  if (ped.precioTotal !== undefined) {
    const totalEsperado = Math.round(ped.cantidad * ped.precioUnitario * 100) / 100;
    if (Math.abs(ped.precioTotal - totalEsperado) > 0.01) {
      errores.push(`El total (S/ ${ped.precioTotal}) no coincide con cantidad × precio unitario (S/ ${totalEsperado})`);
    }
  }
  if (!ped.platoId) errores.push('Falta el plato');
  if (!ped.usuarioId) errores.push('Falta el usuario');
  return errores;
}
