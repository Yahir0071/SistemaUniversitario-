<template>
  <div class="kiosko-app d-flex flex-column min-vh-100">
    <!-- Navbar translúcida unificada con React/Angular -->
    <nav class="fc-navbar py-2 px-3">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center gap-2 text-decoration-none">
          <span class="fc-squircle">🍴</span>
          <span class="fs-5 fw-bold" style="letter-spacing: -0.02em;">
            Food<span class="text-brand">Campus</span>
          </span>
          <span class="fc-pill-badge ms-1" style="background: var(--brand-soft); color: var(--brand); border-color: transparent;">
            Kiosko Vue 3
          </span>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="fc-pill-badge d-none d-md-inline-flex align-items-center gap-2">
            <span class="pulse-dot"></span>
            <span>Actualizado: <strong>{{ horaUltimaActualizacion }}</strong> (30s)</span>
          </span>

          <button
            type="button"
            class="fc-theme-switch"
            @click="alternarTema"
            :title="esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            aria-label="Cambiar tema"
          >
            <span class="fc-theme-btn" :class="{ active: !esOscuro }">☀️</span>
            <span class="fc-theme-btn" :class="{ active: esOscuro }">🌙</span>
          </button>

          <button
            type="button"
            class="btn btn-sm fc-btn-brand px-3 py-2"
            :disabled="cargando"
            @click="cargarDatos(false)"
          >
            {{ cargando ? 'Cargando...' : '↻ Actualizar' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="container py-4 flex-grow-1">
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span class="text-uppercase fw-bold small text-brand" style="letter-spacing: 0.06em;">
            Pantalla Pública de Cafetería
          </span>
          <h1 class="h2 fw-bold mb-1" style="letter-spacing: -0.02em;">
            Turnos de Servicio y Órdenes en Vivo
          </h1>
          <p class="text-muted-fc small mb-0">
            Consulta los pedidos en cocina y la disponibilidad real de cada plato por turno de atención.
          </p>
        </div>

        <div class="d-flex align-items-center gap-2">
          <label for="filtro-fecha" class="small fw-semibold text-muted-fc mb-0">Fecha:</label>
          <select
            id="filtro-fecha"
            v-model="fechaFiltro"
            class="form-select form-select-sm"
            style="min-width: 170px; background-color: var(--surface); color: var(--ink); border-color: var(--line); border-radius: 9999px; padding: 0.4rem 1rem;"
          >
            <option :value="fechaHoy">Hoy ({{ fechaHoy }})</option>
            <option value="">Todas las fechas</option>
          </select>
        </div>
      </div>

      <!-- 3 Tarjetas de resumen -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">🍽️ Platos disponibles</span>
            <p class="fs-4 fw-bold mb-0 mt-1">{{ platosDisponibles }} de {{ platos.length }} platos</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">👨‍🍳 Pedidos activos ({{ etiquetaFecha }})</span>
            <p class="fs-4 fw-bold mb-0 mt-1 text-brand">{{ pedidosActivos.length }} órdenes</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">⏱️ Actualización automática</span>
            <p class="fs-4 fw-bold mb-0 mt-1" style="color: var(--moss);">Cada 30 segundos</p>
          </div>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger rounded-4 py-3 mb-4 d-flex justify-content-between align-items-center">
        <span><strong>Error de conexión:</strong> {{ error }}</span>
        <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3" @click="cargarDatos(false)">
          Reintentar
        </button>
      </div>

      <div v-if="cargando && platos.length === 0" class="text-center py-5">
        <div class="spinner-border text-warning mb-3" role="status"></div>
        <p class="text-muted-fc">Cargando pantalla de cafetería...</p>
      </div>

      <template v-else>
        <MonitorPedidos :pedidos="pedidosFiltradosFecha" :platos="platos" />
        <GrillaDisponibilidad :platos="platos" :pedidos="pedidosFiltradosFecha" />
      </template>
    </main>

    <footer class="py-3 text-center border-top small text-muted-fc" style="border-color: var(--line) !important;">
      FoodCampus · Kiosko Vue 3 (Options API · Puerto 5174)
    </footer>
  </div>
</template>

<script>
import MonitorPedidos from './components/MonitorPedidos.vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const TEMA_KEY = 'foodcampus_tema';

function obtenerHoyIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default {
  name: 'App',
  components: { MonitorPedidos, GrillaDisponibilidad },
  data() {
    return {
      platos: [],
      pedidos: [],
      cargando: false,
      error: null,
      temporizador: null,
      horaUltimaActualizacion: '--:--:--',
      esOscuro: false,
      fechaHoy: obtenerHoyIso(),
      fechaFiltro: '',
    };
  },
  computed: {
    platosDisponibles() {
      return this.platos.filter((p) => p.estado === 'disponible').length;
    },
    pedidosFiltradosFecha() {
      if (!this.fechaFiltro) return this.pedidos;
      return this.pedidos.filter((p) => p.fecha === this.fechaFiltro);
    },
    pedidosActivos() {
      return this.pedidosFiltradosFecha.filter((p) => p.estado !== 'rechazada');
    },
    etiquetaFecha() {
      return this.fechaFiltro ? 'hoy' : 'todas las fechas';
    },
  },
  mounted() {
    try {
      this.esOscuro = localStorage.getItem(TEMA_KEY) === 'dark';
    } catch {
      this.esOscuro = false;
    }
    this.aplicarTema();
    this.cargarDatos();
    this.temporizador = setInterval(() => this.cargarDatos(true), 30000);
  },
  beforeUnmount() {
    if (this.temporizador) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  },
  methods: {
    aplicarTema() {
      const tema = this.esOscuro ? 'dark' : 'light';
      document.documentElement.setAttribute('data-bs-theme', tema);
      document.documentElement.classList.toggle('dark', this.esOscuro);
    },
    alternarTema() {
      this.esOscuro = !this.esOscuro;
      this.aplicarTema();
      try {
        localStorage.setItem(TEMA_KEY, this.esOscuro ? 'dark' : 'light');
      } catch {}
    },
    async cargarDatos(silencioso = false) {
      if (!silencioso) this.cargando = true;
      this.error = null;
      try {
        const [resPlatos, resPedidos] = await Promise.all([
          fetch(`${API_URL}/platos`),
          fetch(`${API_URL}/pedidos`),
        ]);
        if (!resPlatos.ok || !resPedidos.ok) {
          throw new Error(`No se pudo conectar con la API REST en ${API_URL}.`);
        }
        this.platos = await resPlatos.json();
        this.pedidos = await resPedidos.json();
        this.horaUltimaActualizacion = new Date().toLocaleTimeString();
      } catch (err) {
        this.error = err.message || 'Error al cargar datos.';
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>

<style scoped>
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--moss);
  display: inline-block;
}
</style>
