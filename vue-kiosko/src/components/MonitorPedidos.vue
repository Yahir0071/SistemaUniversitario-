<template>
  <section class="row g-3 mb-4">
    <div class="col-lg-6">
      <div class="fc-card p-3 p-md-4 h-100">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <span class="dot-status" style="background: var(--ochre);"></span>
            Por confirmar en cocina
          </h2>
          <span class="fc-pill-badge" style="background: var(--ochre-soft); color: var(--ochre);">
            {{ pendientes.length }}
          </span>
        </div>

        <div v-if="pendientes.length > 0" class="d-flex flex-wrap gap-2">
          <div
            v-for="ped in pendientes"
            :key="ped.id"
            class="px-3 py-2 rounded-4 border d-flex align-items-center gap-2"
            style="background: var(--surface-sunken); border-color: var(--line) !important;"
          >
            <strong class="font-monospace text-brand">{{ ped.codigo }}</strong>
            <span class="small text-muted-fc">{{ nombrePlato(ped.platoId) }} (×{{ ped.cantidad }})</span>
            <span v-if="ped.hora" class="badge rounded-pill" style="background: var(--ochre-soft); color: var(--ochre);">
              {{ ped.hora }}
            </span>
          </div>
        </div>
        <p v-else class="small text-muted-fc mb-0">No hay pedidos pendientes de confirmación.</p>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="fc-card p-3 p-md-4 h-100">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <span class="dot-status" style="background: var(--moss);"></span>
            En preparación / Listos en mostrador
          </h2>
          <span class="fc-pill-badge" style="background: var(--moss-soft); color: var(--moss);">
            {{ aprobados.length }}
          </span>
        </div>

        <div v-if="aprobados.length > 0" class="d-flex flex-wrap gap-2">
          <div
            v-for="ped in aprobados"
            :key="ped.id"
            class="px-3 py-2 rounded-4 border d-flex align-items-center gap-2"
            style="background: var(--moss-soft); border-color: color-mix(in srgb, var(--moss) 30%, transparent) !important;"
          >
            <strong class="font-monospace" style="color: var(--moss);">{{ ped.codigo }}</strong>
            <span class="small fw-medium">{{ nombrePlato(ped.platoId) }} (×{{ ped.cantidad }})</span>
            <span v-if="ped.hora" class="small text-muted-fc">· {{ ped.hora }}</span>
          </div>
        </div>
        <p v-else class="small text-muted-fc mb-0">Sin órdenes en preparación para la fecha seleccionada.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MonitorPedidos',
  props: {
    pedidos: { type: Array, required: true },
    platos: { type: Array, required: true },
  },
  computed: {
    pendientes() {
      return this.pedidos.filter((p) => p.estado === 'pendiente').slice(0, 8);
    },
    aprobados() {
      return this.pedidos.filter((p) => p.estado === 'aprobada').slice(0, 8);
    },
    mapaPlatos() {
      return new Map(this.platos.map((pl) => [Number(pl.id), pl.nombre]));
    },
  },
  methods: {
    nombrePlato(id) {
      return this.mapaPlatos.get(Number(id)) || `Plato #${id}`;
    },
  },
};
</script>

<style scoped>
.dot-status {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
</style>
