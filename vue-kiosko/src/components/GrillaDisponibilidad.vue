<template>
  <div class="grilla-disponibilidad">
    <!-- Header de Filtros y Leyenda -->
    <div class="fc-card p-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center gap-3">
          <label for="filtro-categoria" class="small fw-semibold text-uppercase" style="color: var(--ink-muted); letter-spacing: 0.05em;">
            Filtrar por categoría:
          </label>
          <select
            id="filtro-categoria"
            v-model="filtroCategoria"
            class="form-select form-select-sm"
            style="min-width: 220px; background-color: var(--surface-sunken); color: var(--ink); border-color: var(--line); border-radius: 9999px; padding: 0.45rem 1.2rem;"
          >
            <option value="">Todas las categorías ({{ platos.length }})</option>
            <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Leyenda con diseño Figma -->
        <div class="d-flex align-items-center gap-3 small">
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--moss-soft); color: var(--moss); border-color: rgba(104,173,139,0.3);">
            <span class="badge-dot" style="background-color: var(--moss);"></span> Libre
          </span>
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--ochre-soft); color: var(--ochre); border-color: rgba(240,160,36,0.35);">
            <span class="badge-dot" style="background-color: var(--ochre);"></span> Pendiente
          </span>
          <span class="fc-pill-badge d-flex align-items-center gap-2" style="background-color: var(--ember-soft); color: var(--ember); border-color: rgba(255,96,43,0.35);">
            <span class="badge-dot" style="background-color: var(--ember);"></span> Ocupada
          </span>
        </div>
      </div>
    </div>

    <!-- Contenedor de la Tabla de Disponibilidad -->
    <div class="kiosko-grid-wrapper mb-4">
      <div class="kiosko-scroll">
        <table class="kiosko-table">
          <thead>
            <tr>
              <th class="col-plato-header">Plato del Menú</th>
              <th v-for="hora in franjasHorarias" :key="hora">
                {{ hora }}
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
                    style="width: 44px; height: 44px; border: 1px solid var(--line);"
                  />
                  <div>
                    <div class="fw-semibold small text-truncate" style="max-width: 170px;" :title="fila.plato.nombre">
                      {{ fila.plato.nombre }}
                    </div>
                    <div class="d-flex align-items-center gap-2" style="font-size: 0.75rem;">
                      <span style="color: var(--ink-muted);">{{ fila.plato.categoria }}</span>
                      <span class="fw-bold" style="color: var(--brand);">S/ {{ fila.plato.precio.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Componente CeldaHorario -->
              <td v-for="celda in fila.celdas" :key="celda.hora">
                <CeldaHorario
                  :plato="fila.plato"
                  :hora="celda.hora"
                  :pedidos="pedidos"
                  @ver-detalle="mostrarDetalle"
                />
              </td>
            </tr>

            <tr v-if="grillaBidimensional.length === 0">
              <td :colspan="franjasHorarias.length + 1" class="text-center py-5" style="color: var(--ink-muted);">
                No hay platos en la categoría seleccionada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de detalle de turno (v-if) -->
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
              <span class="fc-pill-badge mb-1 d-inline-block">{{ celdaSeleccionada.plato.categoria }}</span>
              <h4 class="h5 fw-bold mb-0" style="color: var(--ink);">{{ celdaSeleccionada.plato.nombre }}</h4>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-link text-decoration-none" style="color: var(--ink-muted);" @click="cerrarDetalle">✕</button>
        </div>

        <div class="p-3 rounded-4 mb-3" style="background-color: var(--surface-sunken); border: 1px solid var(--line);">
          <div class="d-flex justify-content-between mb-2 small">
            <span style="color: var(--ink-muted);">Franja horaria:</span>
            <strong style="color: var(--ink);">{{ celdaSeleccionada.hora }} hrs</strong>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span style="color: var(--ink-muted);">Precio unitario:</span>
            <strong style="color: var(--brand);">S/ {{ celdaSeleccionada.plato.precio.toFixed(2) }}</strong>
          </div>
          <div class="d-flex justify-content-between small">
            <span style="color: var(--ink-muted);">Disponibilidad:</span>
            <span
              class="badge text-uppercase"
              :class="{
                'bg-success': celdaSeleccionada.estado === 'libre',
                'bg-warning text-dark': celdaSeleccionada.estado === 'pendiente',
                'bg-danger': celdaSeleccionada.estado === 'ocupada',
              }"
            >
              ● {{ celdaSeleccionada.estado }}
            </span>
          </div>
        </div>

        <div v-if="celdaSeleccionada.pedidos.length > 0" class="mb-3">
          <div class="small fw-bold text-uppercase mb-2" style="color: var(--ink-muted); font-size: 0.72rem; letter-spacing: 0.05em;">
            Órdenes en este horario:
          </div>
          <div class="d-flex flex-column gap-2">
            <div
              v-for="p in celdaSeleccionada.pedidos"
              :key="p.id"
              class="p-2 rounded-3 d-flex justify-content-between align-items-center"
              style="background-color: var(--surface-raised); border: 1px solid var(--line);"
            >
              <div>
                <span class="fw-bold me-2" style="color: var(--brand); font-family: monospace;">{{ p.codigo }}</span>
                <span class="small" style="color: var(--ink-muted);">{{ p.cantidad }} unid.</span>
              </div>
              <span class="badge" :class="p.estado === 'aprobada' ? 'bg-danger' : 'bg-warning text-dark'">
                {{ p.estado }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-3 mb-3 small" style="color: var(--moss);">
          ✓ Sin reservas conflictivas. Horario óptimo para retiro de pedidos.
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
  components: {
    CeldaHorario,
  },
  props: {
    platos: {
      type: Array,
      required: true,
    },
    pedidos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filtroCategoria: '',
      celdaSeleccionada: null,
      franjasHorarias: [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
        '19:00', '20:00', '21:00', '22:00',
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
      return this.platosFiltrados.map((p) => {
        const platoModelo = new Plato(p);
        const celdas = this.franjasHorarias.map((hora) => ({
          hora,
          platoId: platoModelo.id,
        }));
        return {
          plato: platoModelo,
          celdas,
        };
      });
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
