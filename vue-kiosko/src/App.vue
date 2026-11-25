<template>
  <div class="kiosko-app d-flex flex-column min-vh-100">
    <!-- Navbar translúcida estilo React/Figma -->
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
          <span class="fc-pill-badge d-none d-sm-inline-flex align-items-center gap-2">
            <span class="pulse-dot"></span>
            <span>Actualizado: <strong>{{ horaUltimaActualizacion }}</strong> (30s)</span>
          </span>

          <button
            type="button"
            class="btn btn-sm rounded-pill px-3"
            style="background: var(--surface-sunken); border: 1px solid var(--line); color: var(--ink);"
            @click="alternarTema"
            title="Cambiar tema claro/oscuro"
          >
            {{ esOscuro ? '☀️' : '🌙' }}
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
      <div class="mb-4">
        <span class="text-uppercase fw-bold small text-brand" style="letter-spacing: 0.06em;">
          Pantalla de Disponibilidad en Tiempo Real
        </span>
        <h1 class="h2 fw-bold mb-1" style="letter-spacing: -0.02em;">
          Horarios de Atención en Cafetería
        </h1>
        <p class="text-muted-fc small mb-0">
          Consulta al instante la disponibilidad de cada plato por franja horaria (07:00 – 22:00). Haz clic en cualquier celda para ver las órdenes.
        </p>
      </div>

      <!-- 3 Tarjetas de resumen estilo React HomePage -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">🍽️ Platos monitoreados</span>
            <p class="fs-4 fw-bold mb-0 mt-1">{{ platos.length }} platos en menú</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">⏱️ Frecuencia de refresco</span>
            <p class="fs-4 fw-bold mb-0 mt-1 text-brand">Cada 30 segundos</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="fc-card p-3 h-100">
            <span class="text-muted-fc small fw-semibold">📦 Órdenes registradas hoy</span>
            <p class="fs-4 fw-bold mb-0 mt-1" style="color: var(--moss);">{{ pedidos.length }} pedidos</p>
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
        <p class="text-muted-fc">Cargando grilla de disponibilidad...</p>
      </div>

      <GrillaDisponibilidad
        v-else
        :platos="platos"
        :pedidos="pedidos"
      />
    </main>

    <footer class="py-3 text-center border-top small text-muted-fc" style="border-color: var(--line) !important;">
      FoodCampus · Kiosko Vue 3 (Options API · Puerto 5174)
    </footer>
  </div>
</template>

<script>
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';

export default {
  name: 'App',
  components: { GrillaDisponibilidad },
  data() {
    return {
      platos: [],
      pedidos: [],
      cargando: false,
      error: null,
      temporizador: null,
      horaUltimaActualizacion: '--:--:--',
      esOscuro: false,
    };
  },
  mounted() {
    this.cargarDatos();
    this.temporizador = setInterval(() => {
      this.cargarDatos(true);
    }, 30000);
  },
  beforeUnmount() {
    if (this.temporizador) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  },
  methods: {
    alternarTema() {
      this.esOscuro = !this.esOscuro;
      document.documentElement.setAttribute('data-bs-theme', this.esOscuro ? 'dark' : 'light');
    },
    async cargarDatos(silencioso = false) {
      if (!silencioso) this.cargando = true;
      this.error = null;
      try {
        const [resPlatos, resPedidos] = await Promise.all([
          fetch('http://localhost:3000/platos'),
          fetch('http://localhost:3000/pedidos'),
        ]);
        if (!resPlatos.ok || !resPedidos.ok) {
          throw new Error('No se pudo conectar con la API REST en http://localhost:3000.');
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
