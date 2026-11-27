<template>
  <div
    class="celda-slot px-2"
    :class="claseEstado"
    @click="seleccionar"
    :title="`${plato.nombre} (${turno.nombre}): ${etiquetaEstado}`"
  >
    <span class="d-flex align-items-center gap-1">
      <span v-if="estadoCalculado !== 'fuera'" class="dot-indicator" :style="{ backgroundColor: colorPunto }"></span>
      <span>{{ etiquetaEstado }}</span>
    </span>
  </div>
</template>

<script>
const TURNOS_POR_CATEGORIA = {
  Desayunos: ['desayuno', 'tarde'],
  Almuerzos: ['almuerzo'],
  Saludable: ['almuerzo', 'tarde'],
  Snacks: ['desayuno', 'almuerzo', 'tarde'],
  Bebidas: ['desayuno', 'almuerzo', 'tarde'],
  Postres: ['desayuno', 'almuerzo', 'tarde'],
};

const TOPE_PORCIONES_TURNO = 10;

export default {
  name: 'CeldaHorario',
  props: {
    plato: { type: Object, required: true },
    turno: { type: Object, required: true },
    pedidos: { type: Array, default: () => [] },
  },
  emits: ['ver-detalle'],
  computed: {
    seSirveEnTurno() {
      const permitidos = TURNOS_POR_CATEGORIA[this.plato.categoria] || ['desayuno', 'almuerzo', 'tarde'];
      return permitidos.includes(this.turno.id);
    },
    pedidosCelda() {
      if (!this.seSirveEnTurno) return [];
      return this.pedidos.filter((p) => {
        if (Number(p.platoId) !== Number(this.plato.id)) return false;
        if (p.estado === 'rechazada') return false;
        const hora = p.hora || (p.creadoEn && p.creadoEn.length >= 16 ? p.creadoEn.slice(11, 16) : '12:00');
        const h = Number(hora.slice(0, 2));
        return h >= this.turno.horaInicio && h <= this.turno.horaFin;
      });
    },
    porcionesEnTurno() {
      return this.pedidosCelda.reduce((sum, p) => sum + (Number(p.cantidad) || 1), 0);
    },
    estadoCalculado() {
      if (!this.seSirveEnTurno) return 'fuera';
      if (this.plato.estado === 'agotado') return 'agotado';
      if (this.porcionesEnTurno >= TOPE_PORCIONES_TURNO) return 'saturado';
      if (this.pedidosCelda.length > 0) return 'demanda';
      return 'disponible';
    },
    claseEstado() {
      return {
        'slot-fuera': this.estadoCalculado === 'fuera',
        'slot-libre': this.estadoCalculado === 'disponible',
        'slot-pendiente': this.estadoCalculado === 'demanda',
        'slot-ocupada': this.estadoCalculado === 'agotado' || this.estadoCalculado === 'saturado',
      };
    },
    etiquetaEstado() {
      if (this.estadoCalculado === 'fuera') return '— Fuera de turno';
      if (this.estadoCalculado === 'agotado') return 'Agotado';
      if (this.estadoCalculado === 'saturado') return `Tope (${this.porcionesEnTurno} porc.)`;
      if (this.estadoCalculado === 'demanda') return `${this.porcionesEnTurno} porc. en cocina`;
      return 'Disponible';
    },
    colorPunto() {
      if (this.estadoCalculado === 'agotado' || this.estadoCalculado === 'saturado') return 'var(--ember)';
      if (this.estadoCalculado === 'demanda') return 'var(--ochre)';
      return 'var(--moss)';
    },
  },
  methods: {
    seleccionar() {
      this.$emit('ver-detalle', {
        plato: this.plato,
        turno: this.turno,
        estado: this.estadoCalculado,
        porciones: this.porcionesEnTurno,
        pedidos: this.pedidosCelda,
      });
    },
  },
};
</script>

<style scoped>
.dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
</style>
