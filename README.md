# FoodCampus – Proyecto Integral (JavaScript Avanzado)

**Repositorio:** [https://github.com/Yahir0071/SistemaUniversitario-](https://github.com/Yahir0071/SistemaUniversitario-)
**Dominio:** FoodCampus (Gestión de Menú, Platos y Pedidos de Cafetería Universitaria)

## Integrantes del Grupo
| N° | Nombre Completo | Código UTP | Rol / Responsabilidad en Avance 1, 2, 3 y 4 |
|:--:|:----------------|:----------:|:--------------------------------------|
| 1  | Yahir Anthony Huaira Yauri | U24253852 | `core-js` (Validadores, Modelos, Estadísticas), Catálogo de Platos Angular y Portal React |
| 2  | Angello Gabriel Enciso Abril | U24257462 | `api-mock` (db.json, endpoints json-server), Integración REST y Colección Postman |
| 3  | Mathias Sebastián Loreto Peñaranda | U24223538 | `angular-admin` (Routing, Servicios Plato/Pedido, Interfaces) y Portal SSR Next.js |
| 4  | Esaul Ronaldo Chancan Moreno | U24233179 | `angular-admin` (Gestión de Pedidos, Pipes, Directivas) y Kiosko Vue 3 |
| 5  | Jeferson Alonso Almerco Ramirez | U23249977 | `readme.md` Documentación, Cuadros Comparativos y Pruebas Generales (QA) |

---

## Guía de Ejecución de Servidores

### 1. Núcleo JS (Pruebas unitarias con Node.js)
```bash
cd core-js
node --test
```
*Ejecuta 12 pruebas automatizadas sin dependencias externas usando el runner nativo `node:test` y `node:assert/strict`.*

### 2. Backend Simulado (API REST en puerto 3000)
```bash
cd api-mock
npm install # o npm ci
npm run api
```
*Levanta `json-server` en `http://localhost:3000` con persistencia en `db.json` con entidades `usuarios`, `platos` y `pedidos`.*

### 3. Panel Administrativo Angular (Puerto 4200) – Avance 1
```bash
cd angular-admin
npm install # o npm ci
npm run sync-core
npm start
```
*Abre el panel administrativo en `http://localhost:4200` conectado a la API de `http://localhost:3000`.*
*Para ejecutar las pruebas unitarias de Angular con Vitest:* `npm test`.

### 4. Portal del Estudiante React + Vite (Puerto 5173) – Avances 2 y 3
Levanta primero `api-mock`. React y Angular usan la misma API en `http://localhost:3000`.

```bash
cd react-estudiante
npm install # o npm ci
npm run sync-core # sincroniza lógica y validadores de core-js
npm run dev
```
*Abre la aplicación del estudiante en `http://localhost:5173`.*

* **Credenciales Demo para inicio de sesión de estudiante:**
  * **Correo:** `u20231234@utp.edu.pe`
  * **Contraseña:** `est123`
  * *(También disponible el botón directo "Autocompletar cuenta demo (Luis Quispe)" en `/login`)*
* **Comandos adicionales de React:**
  * `npm run build`: Compilación optimizada para producción en `dist/`.
  * `npm run lint`: Análisis estático de código con Oxlint.

### 5. Kiosko de Disponibilidad Vue 3 (Puerto 5174) – Avance 4
Kiosko de pantalla informativa que consulta la disponibilidad del día en tiempo real.
```bash
cd vue-kiosko
npm install # o npm ci
npm run sync-core # sincroniza modelos y estadísticas de core-js
npm run dev
```
*Abre el kiosko en `http://localhost:5174` conectado a `http://localhost:3000`.*
* **Comandos adicionales:**
  * `npm run build`: Compilación optimizada para producción en `dist/`.

### 6. Portal Público SSR Next.js (Puerto 3001) – Avance 4
Web pública renderizada en el servidor para consulta del menú y rastreo de pedidos sin iniciar sesión.
```bash
cd next-publico
npm install # o npm ci
npm run sync-core # sincroniza modelos de core-js
npm run dev
```
*Abre el portal público SSR en `http://localhost:3001` conectado a `http://localhost:3000`.*
* **Rutas públicas disponibles:**
  * `/platos`: Catálogo público renderizado en servidor (SSR).
  * `/platos/:id`: Ficha de plato con SSR y órdenes aprobadas de la semana.
  * `/pedidos/buscar`: Formulario público de rastreo.
  * `/pedidos/:codigo`: Estado en vivo de una orden por código (ej. `PED-0001`), con página de no encontrado si el código no existe.
* **Comandos adicionales:**
  * `npm run build`: Compilación optimizada de producción (`next build`).
  * `npm start`: Inicia el servidor de producción en el puerto 3001 (`next start -p 3001`).

---

## Avance 2 – Portal React del Estudiante (Semana 14)
El portal permite a los estudiantes navegar el catálogo de platos, filtrar por categoría y búsqueda de texto, iniciar sesión simulada y registrar sus pedidos con validaciones de negocio en tiempo real.

### Requisitos Implementados:
1. **Proyecto Vite (JSX) con Bootstrap 5:** Estructurado en módulos limpios y responsivos.
2. **Componentes con props (< 120 líneas):**
   * `Navbar`: Barra superior responsiva con navegación condicional y selector de tema claro/oscuro en 1 clic.
   * `TarjetaPlato`: Presentación individual de cada plato con precios, categorías y acciones.
   * `ListaPlatos`: Renderizado en grilla responsiva con manejo de estado vacío y `key` única.
   * `FormularioPedido` (apoyado en `CampoForm`): Formulario controlado en tarjetas apiladas con mensajes de error por campo y autoenfoque con `useRef`.
   * `SelectorFranjas`: Selector dinámico de 7 días (domingos cerrados) y horarios cada 30 min por franja (mañana, mediodía, tarde) con bloqueo de horas pasadas.
   * `ResumenPedidoCard`: Panel sticky lateral con vista previa del plato, desglose de precio y total estimado.
   * `TicketConfirmado`: Comprobante visual de confirmación con código de pedido `PED-XXXX`.
   * `BadgeEstado`: Etiqueta visual para estados de platos y pedidos.
   * `ContadorProximoPedido`: Alerta informativa con cuenta regresiva en vivo.
   * `ModalCancelarPedido`: Modal accesible con backdrop blur para confirmación de cancelación de pedidos.
   * `RutaProtegida`: Wrapper de seguridad para restringir vistas sin autenticación.
3. **Navegación con `react-router-dom` (7 rutas):**
   * `/`: Página de inicio (`HomePage`) con resumen y métricas.
   * `/catalogo`: Catálogo completo de platos (`CatalogoPage`).
   * `/catalogo/:id`: Detalle extendido del plato (`DetallePlatoPage`) leyendo parámetro vía `useParams`.
   * `/login`: Inicio de sesión del estudiante (`LoginPage`).
   * `/mis-pedidos`: Lista de pedidos del estudiante (`MisPedidosPage`) — **Ruta protegida**.
   * `/nuevo-pedido`: Registro de nuevo pedido (`NuevoPedidoPage`) — **Ruta protegida**.
   * `*`: Página 404 para rutas inexistentes (`NotFoundPage`).
4. **Hooks con casos de uso reales:**
   * `useState`: Filtros reactivos por categoría y texto en catálogo, y lista dinámica de pedidos.
   * `useEffect`: Actualización del título de la pestaña del navegador según la página (`useTituloPagina`) y temporizador de cuenta regresiva en vivo con limpieza `clearInterval` al desmontar.
   * `useContext`: `AuthContext` (usuario en sesión y login/logout) y `ThemeContext` (alternancia modo claro/oscuro con `data-bs-theme`).
   * `useRef`: Autoenfoque automático en el primer campo del formulario (`select` de plato) y reinicio de foco tras guardar.
5. **Formulario y Reutilización de `core-js`:**
   * Formulario controlado que reutiliza `esFecha`, `esHora`, `validarPedido` y los modelos `Plato` y `Pedido` de `core-js`.
   * **Bloqueo de cruce de horarios:** Impide que un mismo estudiante registre dos pedidos activos en la misma fecha y hora.

---

## Avance 3 – Integración REST con Angular (Semana 15)

| Herramienta | Uso en FoodCampus | Comportamiento |
| --- | --- | --- |
| Fetch API | `GET /platos`, `GET /platos/:id` y `GET /usuarios?correo=...` | `consultar` usa `async/await` y comprueba `response.ok`. El catálogo y el detalle muestran sus estados de carga, error y vacío. |
| Axios | `POST /pedidos` y `DELETE /pedidos/:id` | Una instancia con `baseURL` traduce errores HTTP mediante un interceptor. El formulario muestra el ticket después de que la API guarda el pedido. |
| Alova | `GET /pedidos?usuarioId=...` | `usePedidos(usuarioId)` utiliza `useRequest` y reutiliza `pedidosPorEstado` de `core-js`. La consulta se guarda 30 segundos en memoria por usuario. **Actualizar pedidos** fuerza una consulta y las operaciones de escritura invalidan la caché del estudiante. |

El inicio de sesión simulado compara la clave en React y guarda el perfil sin contraseña en `AuthContext` y `localStorage`. El servidor simulado asigna el código `PED-XXXX` usando el generador de `core-js` y json-server persiste los pedidos en `api-mock/db.json`. El pedido conserva la hora de recojo y el total calculado con el modelo `Pedido`.

---

## Avance 4 – Kiosko Vue.js y Portal Público SSR con Next.js (Semana 16)

Dos frontends nuevos conectados sobre el mismo contrato REST (`http://localhost:3000`):

### 1. Kiosko Vue 3 (`vue-kiosko` · Puerto 5174)
* **Framework:** Vite + Vue 3 configurado con **Options API** (`data`, `computed`, `methods`, `mounted`, `beforeUnmount`).
* **Componentes:**
  * `GrillaDisponibilidad.vue`: Componente padre que gestiona el filtro de categoría con `v-model` y renderiza la grilla bidimensional.
  * `CeldaHorario.vue`: Componente hijo comunicado mediante **props** (`plato`, `hora`, `pedidos`) y **evento personalizado `$emit('ver-detalle')`**.
* **Grilla Bidimensional:** Construida a partir de la combinación de platos del menú por franjas horarias de **07:00 a 22:00**, reutilizando `Plato` y `categoriasUnicas` de `core-js`.
* **Estados de Celda:** Cada celda computa y se pinta condicionalmente con clases reactivas (`v-bind:class`):
  * 🟢 **Libre:** Plato disponible y sin conflicto de pedidos aprobados.
  * 🟡 **Pendiente:** Existen pedidos registrados pendientes de aprobación en ese turno.
  * 🔴 **Ocupada / Agotada:** Plato marcado como agotado o con pedidos aprobados en cocina.
* **Directivas utilizadas:** `v-for` (filas y celdas), `v-if` (modal de detalle y alertas), `v-bind:class` (estilos dinámicos), `v-model` (filtro reactivo por categoría) y `@click` (interacción y apertura del detalle).
* **Ciclo de vida:** Carga inicial asíncrona en `mounted()` con `fetch()` y refresco automático cada 30 segundos (`setInterval`) con su respectiva limpieza de intervalo en `beforeUnmount()`.

### 2. Portal Público SSR Next.js (`next-publico` · Puerto 3001)
* **Framework:** Next.js (App Router) con Server-Side Rendering (SSR).
* **Rutas dinámicas y SSR implementadas:**
  * `/platos`: Catálogo público generado completamente en el servidor (`cache: 'no-store'`).
  * `/platos/[id]`: Ficha técnica de plato con renderizado SSR y tabla de órdenes aprobadas de la semana vinculadas al plato.
  * `/pedidos/[codigo]`: Consulta pública del estado de cualquier pedido por su código (ejemplo: `/pedidos/PED-0001`), con página de no encontrado si el código no existe.
* **Metadatos SEO:** Implementación de `generateMetadata` dinámico por página, configurando `title` y `description` personalizados basados en los datos del recurso.
* **Demostración SSR:** Al abrir *Ver código fuente de la página* (`Ctrl + U`), se evidencia que el HTML llega directamente desde el servidor con todo el contenido renderizado (sin cliente en blanco).

---

## Cuadro Comparativo de Frameworks (Angular, React, Vue y Next.js)

| Criterio | Angular 19 (`angular-admin`) | React 19 (`react-estudiante`) | Vue 3 (`vue-kiosko`) | Next.js (`next-publico`) |
| :--- | :--- | :--- | :--- | :--- |
| **Curva de aprendizaje** | Alta (Requiere dominar TypeScript, Inyección de Dependencias, Decoradores, RxJS y Módulos). | Media (Enfocado en JavaScript moderno, sintaxis JSX y reglas estrictas de Hooks). | Baja / Progresiva (Sintaxis intuitiva con Single File Components `.vue` y estructura limpia con Options API). | Media-Baja para quienes dominan React (App Router introduce convenciones claras de carpetas y Server Components). |
| **Manejo del estado** | Servicios singleton inyectables con `Signals` y `RxJS (BehaviorSubject)`. | Hooks locales (`useState`, `useReducer`), Context API global (`useContext`) y cachés HTTP (`Alova`). | Reactividad profunda nativa (`data()`, `computed`, propiedades reactivas observables). | Server Components sin estado en servidor; estado cliente encapsulado con `'use client'` y hooks. |
| **Enrutamiento** | `@angular/router` configurado estáticamente por código con `Routes`, `RouterOutlet` y guards (`canActivate`). | `react-router-dom` con enrutamiento declarativo en componentes (`<BrowserRouter>`, `<Routes>`, `<Route>`). | En este kiosko se implementó vista única modal interactiva sin necesidad de router pesado (admite `vue-router`). | Enrutamiento basado en el sistema de archivos (File-system routing en la carpeta `app/` con carpetas dinámicas `[id]` y `[codigo]`). |
| **Renderizado** | Client-Side Rendering (CSR) con ciclo de vida gobernado por el runtime de Angular. | Client-Side Rendering (CSR) en SPA compilado ultra-rápido por Vite. | Client-Side Rendering (CSR) reactivo enfocado en pantallas de alta frecuencia de actualización. | Server-Side Rendering (SSR) dinámico bajo demanda en Node.js, enviando HTML completo con metadatos SEO. |
| **Caso de uso en FoodCampus** | Panel administrativo privado para CRUD y aprobación de pedidos. | Portal interactivo para estudiantes autenticados con gestión de reservas. | Kiosko de disponibilidad pública para pantalla táctil en la entrada de la cafetería. | Portal web público indexable en buscadores para consulta y rastreo de tickets. |

---

## Pruebas de API (Postman / Thunder Client)
La colección exportada se encuentra en:
* `postman/campushub-avance1.postman_collection.json`

Incluye pruebas para los métodos HTTP sobre el dominio FoodCampus:
* `GET /platos` (con soporte para filtros `?categoria=` y `?q=`)
* `GET /platos/:id`
* `POST /platos`
* `PUT /platos/:id`
* `DELETE /platos/:id`
* `GET /pedidos`
* `GET /pedidos?usuarioId=`
* `POST /pedidos` (con validación de `precioTotal = cantidad * precioUnitario`)
* `DELETE /pedidos/:id`

---

## Reglas de Negocio Implementadas
1. **Validación de Correo y Código Institucional:** Solo correos `@utp.edu.pe` y códigos de alumno con formato `U` seguido de 8 dígitos.
2. **Códigos de Pedido:** Formato estandarizado `PED-XXXX` generado dinámicamente mediante closures.
3. **Cálculo de Precios:** Regla de consistencia financiera obligatoria: `precioTotal = cantidad * precioUnitario`.
4. **Agrupación y Estadísticas:** Conteo de pedidos por estado mediante `reduce`, resumen de ventas por plato mediante `Map`, extracción de categorías únicas con `Set`, y ranking de platos más pedidos con spread operator y ordenamiento inmutable.
5. **Consistencia de Horarios en Pedidos (Avance 2 y 4):** Un estudiante no puede tener dos pedidos activos programados para la misma fecha y hora de recojo; el kiosko refleja visualmente si el horario está libre, pendiente u ocupado.

---

## Declaración de Uso de IA
En cumplimiento de la Sección 13 del Proyecto Integral:
* Se utilizaron asistentes de IA para el análisis arquitectural, las pruebas, las plantillas de componentes, el andamiaje de los proyectos de Vue y Next.js, y la verificación de las rúbricas de los Avances 1 al 4.
* Todos los integrantes del grupo comprenden y están en capacidad de explicar, modificar y sustentar línea por línea el código presentado en cada módulo.
