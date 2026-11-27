<template>
  <div class="grilla-disponibilidad">
    <!-- Filtros y Leyenda realista de cafetería -->
    <div class="fc-card p-3 p-md-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex flex-wrap align-items-center gap-2">
          <label for="filtro-categoria" class="small fw-semibold text-uppercase mb-0" style="color: var(--ink-muted); letter-spacing: 0.05em;">
            Categoría:
          </label>
          <select
            id="filtro-categoria"
            v-model="filtroCategoria"
            class="form-select form-select-sm"
            style="min-width: 210px; background-color: var(--surface-sunken); color: var(--ink); border-color: var(--line); border-radius: 9999px; padding: 0.45rem 1.2rem;"
          >
            <option value="">Todas las categorías ({{ platos.length }})</option>
            <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 small">
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--moss-soft); color: var(--moss);">
            <span class="badge-dot" style="background-color: var(--moss);"></span> Disponible
          </span>
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--ochre-soft); color: var(--ochre);">
            <span class="badge-dot" style="background-color: var(--ochre);"></span> Con pedidos en cocina
          </span>
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--ember-soft); color: var(--ember);">
            <span class="badge-dot" style="background-color: var(--ember);"></span> Agotado / Tope lleno
          </span>
        </div>
      </div>
    </div>

    <!-- Grilla por Turnos Reales de Cafetería -->
    <div class="kiosko-grid-wrapper mb-4">
      <div class="kiosko-scroll">
        <table class="kiosko-table">
          <thead>
            <tr>
              <th class="col-plato-header">Plato del Menú</th>
              <th v-for="turno in turnosServicio" :key="turno.id" style="min-width: 190px;">
                <div>{{ turno.icono }} {{ turno.nombre }}</div>
                <div style="font-size: 0.68rem; font-weight: 500; opacity: 0.8;">{{ turno.rango }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fila in grillaBidimensional" :key="fila.plato.id">
              <td class="col-plato-cell">
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="obtenerImagen(fila.plato.id, fila.plato.imagen)"
                    alt=""
                    class="rounded-3 object-fit-cover flex-shrink-0"
                    style="width: 46px; height: 46px; border: 1px solid var(--line);"
                  />
                  <div>
                    <div class="fw-semibold small text-truncate" style="max-width: 190px;" :title="fila.plato.nombre">
                      {{ fila.plato.nombre }}
                    </div>
                    <div class="d-flex align-items-center gap-2" style="font-size: 0.75rem;">
                      <span style="color: var(--ink-muted);">{{ fila.plato.categoria }}</span>
                      <span class="fw-bold" style="color: var(--brand);">S/ {{ fila.plato.precio.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td v-for="turno in turnosServicio" :key="turno.id">
                <CeldaHorario
                  :plato="fila.plato"
                  :turno="turno"
                  :pedidos="pedidos"
                  @ver-detalle="mostrarDetalle"
                />
              </td>
            </tr>

            <tr v-if="grillaBidimensional.length === 0">
              <td :colspan="turnosServicio.length + 1" class="text-center py-5" style="color: var(--ink-muted);">
                No hay platos en la categoría seleccionada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de detalle del turno (v-if) -->
    <div v-if="celdaSeleccionada" class="modal-backdrop-fc" @click.self="cerrarDetalle">
      <div class="fc-card p-4 mx-auto" style="max-width: 520px; width: 100%;">
        <div class="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom" style="border-color: var(--line) !important;">
          <div class="d-flex align-items-center gap-3">
            <img
              :src="obtenerImagen(celdaSeleccionada.plato.id, celdaSeleccionada.plato.imagen)"
              alt=""
              class="rounded-3 object-fit-cover"
              style="width: 54px; height: 54px; border: 1px solid var(--line);"
            />
            <div>
              <span class="small text-muted-fc text-uppercase fw-bold" style="font-size: 0.7rem;">{{ celdaSeleccionada.plato.categoria }}</span>
              <h3 class="h5 fw-bold mb-0">{{ celdaSeleccionada.plato.nombre }}</h3>
            </div>
          </div>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarDetalle"></button>
        </div>

        <div class="p-3 rounded-4 mb-3" style="background: var(--surface-sunken); border: 1px solid var(--line);">
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-muted-fc">Turno consultado:</span>
            <strong>{{ celdaSeleccionada.turno.icono }} {{ celdaSeleccionada.turno.nombre }} ({{ celdaSeleccionada.turno.rango }})</strong>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-muted-fc">Precio unitario:</span>
            <strong class="text-brand">S/ {{ celdaSeleccionada.plato.precio.toFixed(2) }}</strong>
          </div>
          <div class="d-flex justify-content-between small">
            <span class="text-muted-fc">Estado en cocina:</span>
            <strong class="text-uppercase">{{ textoEstadoModal }}</strong>
          </div>
        </div>

        <div v-if="celdaSeleccionada.plato.ingredientes?.length" class="mb-3">
          <div class="small fw-bold text-uppercase text-muted-fc mb-2" style="font-size: 0.72rem;">Ingredientes</div>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="ing in celdaSeleccionada.plato.ingredientes" :key="ing" class="fc-pill-badge">{{ ing }}</span>
          </div>
        </div>

        <div v-if="celdaSeleccionada.pedidos.length > 0" class="mb-3">
          <div class="small fw-bold text-uppercase text-muted-fc mb-2" style="font-size: 0.72rem;">
            Pedidos en este turno ({{ celdaSeleccionada.porciones }} porciones):
          </div>
          <div class="d-flex flex-column gap-2" style="max-height: 170px; overflow-y: auto;">
            <div
              v-for="p in celdaSeleccionada.pedidos"
              :key="p.id"
              class="p-2 px-3 rounded-3 d-flex justify-content-between align-items-center"
              style="background-color: var(--surface-raised); border: 1px solid var(--line);"
            >
              <div>
                <span class="fw-bold me-2 font-monospace text-brand">{{ p.codigo }}</span>
                <span class="small text-muted-fc">{{ p.cantidad }} porc. · {{ p.fecha }} {{ p.hora || '' }}</span>
              </div>
              <span class="badge" :class="p.estado === 'aprobada' ? 'text-bg-success' : 'text-bg-warning'">
                {{ p.estado === 'aprobada' ? 'En preparación' : 'Pendiente' }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 mb-3 small text-muted-fc">
          {{ celdaSeleccionada.estado === 'fuera' ? 'Este plato no se sirve en este turno.' : 'Sin pedidos en cola para este turno.' }}
        </div>

        <button type="button" class="fc-btn-primary w-100" @click="cerrarDetalle">
          Cerrar ventana
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CeldaHorario from './CeldaHorario.vue';
import { Plato } from '../core/modelos.js';
import { categoriasUnicas } from '../core/estadisticas.js';

const IMAGENES = {
  1: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lomo_saltado_peruano.jpg?width=800',
  2: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aj%C3%AD_de_gallina_-_Tradicional.jpg?width=800',
  3: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
  4: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
  5: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
  6: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80',
  7: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80',
  8: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80',
};

export default {
  name: 'GrillaDisponibilidad',
  components: { CeldaHorario },
  props: {
    platos: { type: Array, required: true },
    pedidos: { type: Array, required: true },
  },
  data() {
    return {
      filtroCategoria: '',
      celdaSeleccionada: null,
      turnosServicio: [
        { id: 'desayuno', nombre: 'Desayuno', icono: '☕', rango: '07:30 – 11:30', horaInicio: 7, horaFin: 11 },
        { id: 'almuerzo', nombre: 'Almuerzo', icono: '🍽️', rango: '12:00 – 15:30', horaInicio: 12, horaFin: 15 },
        { id: 'tarde', nombre: 'Tarde / Café', icono: '🌆', rango: '16:00 – 20:00', horaInicio: 16, horaFin: 20 },
      ],
    };
  },
  computed: {
    categoriasDisponibles() {
      return categoriasUnicas(this.platos);
    },
    platosFiltrados() {
      if (!this.filtroCategoria) return this.platos;
      return this.platos.filter((p) => p.categoria === this.filtroCategoria);
    },
    grillaBidimensional() {
      return this.platosFiltrados.map((p) => ({
        plato: Object.assign(new Plato(p), { imagen: p.imagen || '' }),
      }));
    },
    textoEstadoModal() {
      if (!this.celdaSeleccionada) return '';
      const map = {
        fuera: 'Fuera de turno',
        disponible: 'Disponible para ordenar',
        demanda: `${this.celdaSeleccionada.porciones} porciones en preparación`,
        agotado: 'Plato agotado',
        saturado: 'Capacidad de cocina alcanzada',
      };
      return map[this.celdaSeleccionada.estado] || this.celdaSeleccionada.estado;
    },
  },
  methods: {
    obtenerImagen(id, urlOpcional) {
      if (urlOpcional && urlOpcional.trim()) return urlOpcional.trim();
      return IMAGENES[Number(id)] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';
    },
    mostrarDetalle(payload) {
      this.celdaSeleccionada = payload;
    },
    cerrarDetalle() {
      this.celdaSeleccionada = null;
    },
  },
};
</script>

<style scoped>
.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
</style>
