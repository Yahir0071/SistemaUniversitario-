<template>
  <div
    class="celda-slot"
    :class="claseEstado"
    @click="seleccionar"
    :title="`${plato.nombre} a las ${hora}: ${etiquetaEstado}`"
  >
    <span class="d-flex align-items-center gap-1">
      <span class="dot-indicator" :style="{ backgroundColor: colorPunto }"></span>
      <span>{{ etiquetaEstado }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'CeldaHorario',
  props: {
    plato: {
      type: Object,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    pedidos: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['ver-detalle'],
  computed: {
    pedidosCelda() {
      return this.pedidos.filter((p) => {
        if (Number(p.platoId) !== Number(this.plato.id)) return false;
        const horaPedido = p.hora || (p.creadoEn && p.creadoEn.length >= 16 ? p.creadoEn.slice(11, 16) : '');
        return horaPedido.startsWith(this.hora.slice(0, 2));
      });
    },
    estadoCalculado() {
      if (this.plato.estado === 'agotado') {
        return 'ocupada';
      }
      const tieneAprobado = this.pedidosCelda.some((p) => p.estado === 'aprobada');
      if (tieneAprobado) {
        return 'ocupada';
      }
      const tienePendiente = this.pedidosCelda.some((p) => p.estado === 'pendiente');
      if (tienePendiente) {
        return 'pendiente';
      }
      return 'libre';
    },
    claseEstado() {
      return {
        'slot-libre': this.estadoCalculado === 'libre',
        'slot-pendiente': this.estadoCalculado === 'pendiente',
        'slot-ocupada': this.estadoCalculado === 'ocupada',
      };
    },
    etiquetaEstado() {
      switch (this.estadoCalculado) {
        case 'ocupada':
          return 'Ocupada';
        case 'pendiente':
          return 'Pendiente';
        default:
          return 'Libre';
      }
    },
    colorPunto() {
      switch (this.estadoCalculado) {
        case 'ocupada':
          return 'var(--ember)';
        case 'pendiente':
          return 'var(--ochre)';
        default:
          return 'var(--moss)';
      }
    },
  },
  methods: {
    seleccionar() {
      this.$emit('ver-detalle', {
        plato: this.plato,
        hora: this.hora,
        estado: this.estadoCalculado,
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
