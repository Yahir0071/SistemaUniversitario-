// Clases del dominio (S4)
const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

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

export class Laboratorio {
  constructor({ id, nombre, sede, capacidad, equipos = [], estado = 'disponible' }) {
    Object.assign(this, { id, nombre, sede, capacidad, equipos, estado });
  }
  get estaDisponible() {
    return this.estado === 'disponible';
  }
  tieneEquipo(nombre) {
    return this.equipos.some((e) => e.toLowerCase().includes(nombre.toLowerCase()));
  }
  resumen() {
    return `${this.nombre} (${this.sede}) - ${this.capacidad} puestos`;
  }
}

export class Reserva {
  constructor({ id, codigo, laboratorioId, usuarioId, fecha, horaInicio, horaFin, motivo = '', estado = 'pendiente', creadoEn }) {
    Object.assign(this, { id, codigo, laboratorioId, usuarioId, fecha, horaInicio, horaFin, motivo, estado, creadoEn });
  }
  duracionHoras() {
    return (aMinutos(this.horaFin) - aMinutos(this.horaInicio)) / 60;
  }
  // Se cruzan si es el mismo laboratorio, el mismo día y los intervalos se solapan
  seCruzaCon(otra) {
    return (
      this.laboratorioId === otra.laboratorioId &&
      this.fecha === otra.fecha &&
      aMinutos(this.horaInicio) < aMinutos(otra.horaFin) &&
      aMinutos(otra.horaInicio) < aMinutos(this.horaFin)
    );
  }
  get estaActiva() {
    return this.estado !== 'rechazada';
  }
}
