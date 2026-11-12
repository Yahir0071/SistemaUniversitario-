import { Pedido, Plato } from '../core/modelos.js';
import { esFecha, esHora, validarPedido } from '../core/validadores.js';

export function obtenerFechaHoy() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function obtenerHoraPedido(pedido) {
  if (pedido?.hora) return pedido.hora;
  if (pedido?.creadoEn && pedido.creadoEn.length >= 16) {
    return pedido.creadoEn.slice(11, 16);
  }
  return '12:00';
}

export function validarFormularioPedido(valores, platos, pedidosUsuario, usuarioId) {
  const errores = {};
  const plato = platos.find((p) => Number(p.id) === Number(valores.platoId));

  if (!plato) {
    errores.platoId = 'Selecciona un plato del menú.';
  } else if (!new Plato(plato).estaDisponible) {
    errores.platoId = 'Este plato figura como agotado. Elige otro disponible.';
  }

  if (!esFecha(valores.fecha)) {
    errores.fecha = 'Ingresa una fecha válida con formato AAAA-MM-DD.';
  } else if (valores.fecha < obtenerFechaHoy()) {
    errores.fecha = 'La fecha de recojo no puede ser anterior a hoy.';
  }

  if (!esHora(valores.hora)) {
    errores.hora = 'Ingresa una hora válida en formato HH:mm (ej. 12:30).';
  }

  const cantidad = Number(valores.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
    errores.cantidad = 'La cantidad debe ser un número entero entre 1 y 20.';
  }

  if (!errores.fecha && !errores.hora) {
    const cruce = pedidosUsuario.find((p) => {
      const modelo = new Pedido(p);
      return modelo.estaActivo && p.fecha === valores.fecha && obtenerHoraPedido(p) === valores.hora;
    });
    if (cruce) {
      errores.hora = `Horario ocupado: ya tienes el pedido ${cruce.codigo} el ${valores.fecha} a las ${valores.hora}.`;
    }
  }

  if (plato && !errores.platoId && !errores.fecha && !errores.cantidad) {
    const modelo = new Pedido({
      platoId: Number(plato.id),
      usuarioId,
      fecha: valores.fecha,
      cantidad,
      precioUnitario: plato.precio,
      notas: valores.notas.trim(),
    });
    const erroresCore = validarPedido({ ...modelo, precioTotal: modelo.precioTotal });
    if (erroresCore.length > 0 && Object.keys(errores).length === 0) {
      errores.general = erroresCore[0];
    }
  }

  return { errores, valido: Object.keys(errores).length === 0 };
}
