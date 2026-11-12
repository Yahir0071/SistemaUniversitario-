# FoodCampus – Portal del Estudiante (React + Vite)

Aplicación SPA desarrollada en **React 19 + Vite + Bootstrap 5.3** correspondiente al **Avance 2 (Semana 14)** del Proyecto Integral de JavaScript Avanzado.

Permite a los estudiantes navegar el catálogo de platos de la cafetería universitaria, buscar por nombre o ingrediente, filtrar por categorías, alternar tema claro/oscuro, iniciar sesión con su correo institucional `@utp.edu.pe` y registrar pedidos controlados con validaciones de negocio en tiempo real.

---

## Guía de Ejecución Rápida

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Sincronización de Núcleo y Datos Locales
```bash
npm run sync-core   # Sincroniza la lógica de dominio y validadores desde ../core-js
npm run sync-data   # Sincroniza los datos iniciales de ../api-mock/db.json
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o el puerto indicado en la terminal).

### 4. Scripts Adicionales
* `npm run build`: Genera el bundle optimizado para producción en la carpeta `dist/`.
* `npm run lint`: Ejecuta el análisis estático de código mediante Oxlint.
* `npm run preview`: Previsualiza localmente el build de producción.

---

## Credenciales Demo para Pruebas
Para probar los flujos protegidos de la aplicación:
* **Correo:** `u20231234@utp.edu.pe`
* **Contraseña:** `est123`
* *(En la pantalla de `/login` también se incluye el botón **"Autocompletar cuenta demo (Luis Quispe)"**).*

---

## Arquitectura y Cumplimiento de Rúbrica

### 1. Componentes con Props (< 120 líneas)
Todos los componentes respetan el límite de tamaño, utilizan props y aplican renderizado condicional y listas con `key`:
* `Navbar`: Barra de navegación con control de sesión y botón de cambio de tema.
* `TarjetaPlato`: Tarjeta individual de catálogo con badge de estado, ingredientes y acciones.
* `ListaPlatos`: Cuadrícula responsiva de platos con mensaje de estado vacío.
* `FormularioPedido` & `CampoForm`: Formulario controlado con validación reactiva campo por campo.
* `BadgeEstado`: Etiqueta para estados de platos y pedidos.
* `ContadorProximoPedido`: Barra informativa con temporizador regresivo.
* `RutaProtegida`: Componente de enrutamiento que redirige al `/login` si no hay sesión activa.

### 2. Navegación con `react-router-dom` (7 Rutas)
* `/`: Inicio con métricas del menú y próximo pedido (`HomePage`).
* `/catalogo`: Catálogo con filtros de búsqueda y categoría (`CatalogoPage`).
* `/catalogo/:id`: Ficha técnica del plato mediante `useParams` (`DetallePlatoPage`).
* `/login`: Autenticación simulada del estudiante (`LoginPage`).
* `/mis-pedidos`: Historial de pedidos del usuario autenticado (**Ruta protegida**).
* `/nuevo-pedido`: Formulario para agendar nuevo pedido (**Ruta protegida**).
* `*`: Manejo de ruta no encontrada 404 (`NotFoundPage`).

### 3. Hooks Utilizados
* **`useState`:** Manejo de filtros reactivos de búsqueda y categoría en catálogo, estados locales de formularios y lista dinámica de pedidos.
* **`useEffect`:** Título dinámico en la pestaña del navegador (`useTituloPagina`) y contador regresivo en vivo con limpieza de intervalo (`clearInterval`) al desmontar (`ContadorProximoPedido`).
* **`useContext`:** `AuthContext` (almacena el usuario autenticado y maneja login/logout) y `ThemeContext` (alterna tema claro y oscuro mediante `data-bs-theme` de Bootstrap).
* **`useRef`:** Foco automático en el primer campo del formulario (`FormularioPedido` y `LoginPage`) y restablecimiento del cursor tras registrar el pedido.

### 4. Validaciones y Reutilización de `core-js`
* Integración directa con `core-js/validadores.js` (`esFecha`, `esHora`, `validarPedido`) y `core-js/modelos.js` (`Plato`, `Pedido`).
* **Regla de negocio adicional:** Bloqueo de cruce de horarios para impedir que un estudiante tenga más de un pedido activo en la misma fecha y hora.
