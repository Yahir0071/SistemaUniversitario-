// Clases del dominio FoodCampus (S4)
export class Usuario {
  constructor({ id, nombre, correo, codigo, rol = 'estudiante', password }) {
    Object.assign(this, { id, nombre, correo, codigo, rol, password });
  }
  get esAdmin() {
    return this.rol === 'admin';
  }
  get iniciales() {
    return this.nombre.split(' ').map((p) => p[0]).join('').toUpperCase();
  }
  perfilPublico() {
    const { password, ...resto } = this;
    return resto;
  }
}

export class Plato {
  constructor({ id, nombre, categoria, precio, ingredientes = [], estado = 'disponible' }) {
    Object.assign(this, { id, nombre, categoria, precio: Number(precio), ingredientes, estado });
  }
  get estaDisponible() {
    return this.estado === 'disponible';
  }
  tieneIngrediente(nombre) {
    return this.ingredientes.some((ing) => ing.toLowerCase().includes(nombre.toLowerCase()));
  }
  resumen() {
    return `${this.nombre} (${this.categoria}) - S/ ${this.precio.toFixed(2)}`;
  }
}

export class Pedido {
  constructor({ id, codigo, platoId, usuarioId, fecha, cantidad = 1, precioUnitario = 0, notas = '', estado = 'pendiente', creadoEn }) {
    Object.assign(this, {
      id,
      codigo,
      platoId,
      usuarioId,
      fecha,
      cantidad: Number(cantidad),
      precioUnitario: Number(precioUnitario),
      notas,
      estado,
      creadoEn,
    });
  }
  get precioTotal() {
    return Math.round(this.cantidad * this.precioUnitario * 100) / 100;
  }
  get estaActivo() {
    return this.estado !== 'rechazada';
  }
  resumen() {
    return `${this.codigo}: ${this.cantidad}x Plato #${this.platoId} - S/ ${this.precioTotal.toFixed(2)}`;
  }
}
