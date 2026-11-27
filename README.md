# FoodCampus – Proyecto Integral (JavaScript Avanzado)

**Repositorio:** [https://github.com/Yahir0071/SistemaUniversitario-](https://github.com/Yahir0071/SistemaUniversitario-)  
**Dominio:** FoodCampus (Gestión de Menú, Platos y Pedidos de Cafetería Universitaria)

## Integrantes del Grupo

| N° | Nombre Completo | Código UTP | Rol / Responsabilidad en Avances 1 al 4 |
|:--:|:----------------|:----------:|:----------------------------------------|
| 1  | Yahir Anthony Huaira Yauri | U24253852 | `core-js` (Validadores, Modelos, Estadísticas), Catálogo de Platos Angular y Portal React |
| 2  | Angello Gabriel Enciso Abril | U24257462 | `api-mock` (`db.json`, `server.mjs`), Integración REST y Colección Postman |
| 3  | Mathias Sebastián Loreto Peñaranda | U24223538 | `angular-admin` (Routing, Servicios Plato/Pedido, Interfaces) y Portal SSR Next.js |
| 4  | Esaul Ronaldo Chancan Moreno | U24233179 | `angular-admin` (Gestión de Pedidos, Pipes, Directivas) y Kiosko Vue 3 |
| 5  | Jeferson Alonso Almerco Ramirez | U23249977 | Documentación (`README.md`), Cuadro Comparativo y Pruebas Generales (QA) |

---

## Arquitectura General y Puertos

| Módulo | Tecnología | Puerto | Avance | Propósito |
| :--- | :--- | :---: | :---: | :--- |
| `core-js/` | JavaScript ES Modules (`node:test`) | — | 1 | Lógica de dominio, modelos POO, validadores y estadísticas reutilizadas por todos los módulos. |
| `api-mock/` | `json-server` + `server.mjs` | `3000` | 1 y 3 | API REST compartida (`usuarios`, `platos`, `pedidos`) con validaciones y generación de códigos `PED-XXXX`. |
| `angular-admin/` | Angular + Bootstrap 5 + Vitest | `4200` | 1 y 3 | Panel administrativo para CRUD de platos y aprobación/rechazo de pedidos. |
| `react-estudiante/` | React 19 + Vite + Fetch/Axios/Alova | `5173` | 2 y 3 | Portal autenticado para estudiantes (catálogo, detalle, registro y gestión de pedidos). |
| `vue-kiosko/` | Vue 3 (Options API) + Vite | `5174` | 4 | Pantalla pública de cafetería (monitor de pedidos en vivo + turnos de servicio cada 30s). |
| `next-publico/` | Next.js (App Router · SSR) | `3001` | 4 | Portal web público renderizado en servidor para consultar el menú y rastrear tickets sin login. |

---

## Guía Rápida de Ejecución

> **Orden recomendado:** levantar primero `api-mock` en el puerto `3000`, ya que Angular, React, Vue y Next.js consumen esa misma API REST.

```bash
# 1. Pruebas del núcleo JS (12 tests)
cd core-js && node --test

# 2. API REST simulada (http://localhost:3000)
cd api-mock && npm install && npm run api

# 3. Panel Admin Angular (http://localhost:4200)
cd angular-admin && npm install && npm run sync-core && npm start

# 4. Portal Estudiante React (http://localhost:5173)
cd react-estudiante && npm install && npm run sync-core && npm run dev

# 5. Kiosko Cafetería Vue 3 (http://localhost:5174)
cd vue-kiosko && npm install && npm run sync-core && npm run dev

# 6. Portal Público SSR Next.js (http://localhost:3001)
cd next-publico && npm install && npm run sync-core && npm run dev
```

* **Cuenta demo de estudiante (React `/login`):** `u20231234@utp.edu.pe` / `est123` *(incluye botón de autocompletado)*.

---

## Avance 1 – Núcleo JS, API Mock y Panel Administrativo Angular

### 1. Núcleo de Dominio (`core-js`)
* **Validadores (`validadores.js`):** Regex para correo `@utp.edu.pe`, código `U` + 8 dígitos, fecha `AAAA-MM-DD`, hora `HH:mm`, código `PED-XXXX`, `validarPlato` y `validarPedido`.
* **Modelos POO (`modelos.js`):** Clases `Usuario`, `Plato` y `Pedido` con getters calculados (`precioTotal = cantidad * precioUnitario`, `estaDisponible`, `estaActivo`) y métodos de dominio.
* **Estadísticas (`estadisticas.js`):** `pedidosPorEstado` (`reduce`), `ventasPorPlato` (`Map`), `categoriasUnicas` (`Set`), `rankingPlatos` (ordenamiento inmutable) y `crearGeneradorCodigos` (closure `PED-XXXX`).
* **Pruebas (`core.test.js`):** 12 pruebas unitarias con `node:test` y `node:assert/strict`.

### 2. API Mock y Colección Postman (`api-mock` + `postman`)
* Persistencia en `api-mock/db.json` con `usuarios`, `platos` y `pedidos`.
* Colección exportada en `postman/campushub-avance1.postman_collection.json` (`GET`, `POST`, `PUT`, `DELETE` sobre `/platos` y `/pedidos`).

### 3. Panel Administrativo (`angular-admin` · Puerto 4200)
* CRUD completo de platos con **Reactive Forms**, validador personalizado (`patron.validator.ts`) y soporte de **imagen opcional**.
* Gestión de pedidos con filtros por estado, pipe personalizado (`estadoPedido`), directiva `resaltar`, modo claro/oscuro persistente y **11 pruebas unitarias en Vitest** (`npm test`).

---

## Avance 2 – Portal del Estudiante en React (Semana 14)

SPA construida con **React 19 + Vite + Bootstrap 5.3** alineada al diseño FoodCampus:

1. **Componentes modulares (`≤ 120` líneas cada uno):**
   * `Navbar`: Barra superior responsiva con navegación condicional y switch de tema claro/oscuro en 1 clic.
   * `TarjetaPlato` y `ListaPlatos`: Tarjetas reutilizables y grilla responsiva con estado vacío y `key` única.
   * `FormularioPedido`, `CampoForm`, `SelectorFranjas`, `ResumenPedidoCard` y `TicketConfirmado`: Formulario controlado dividido en tarjetas apiladas, calendario dinámico de 7 días (domingos cerrados), franjas cada 30 min con bloqueo de horas pasadas, resumen sticky lateral y comprobante `PED-XXXX`.
   * `TablaPedidos`, `BadgeEstado`, `ContadorProximoPedido`, `ModalCancelarPedido` y `RutaProtegida`.
2. **Navegación con `react-router-dom` (7 rutas):**
   * `/` (`HomePage`), `/catalogo` (`CatalogoPage` con filtros laterales), `/catalogo/:id` (`DetallePlatoPage` con `useParams`), `/login` (`LoginPage`), `/mis-pedidos` (**protegida**), `/nuevo-pedido` (**protegida**) y `*` (`NotFoundPage`).
3. **Hooks aplicados:**
   * `useState`: Filtros reactivos, formularios y modales.
   * `useEffect`: Título dinámico (`useTituloPagina`) y cuenta regresiva en vivo con limpieza `clearInterval` (`ContadorProximoPedido`).
   * `useContext`: `AuthContext` (sesión en `localStorage`) y `ThemeContext` (tema claro/oscuro).
   * `useRef`: Autoenfoque automático en el selector de plato al abrir o cambiar plato.
4. **Reutilización de `core-js` y regla de horarios:**
   * Validación en tiempo real con `esFecha`, `esHora`, `validarPedido`, `Plato` y `Pedido`, bloqueando órdenes duplicadas del mismo estudiante en la misma fecha y hora.

---

## Avance 3 – Integración REST Completa (Semana 15)

Se conectó el portal de React al mismo servidor REST de Angular (`http://localhost:3000`) usando tres clientes HTTP diferenciados y validaciones en servidor:

| Herramienta | Endpoints | Comportamiento implementado |
| :--- | :--- | :--- |
| **Fetch API** | `GET /platos`, `GET /platos/:id`, `GET /usuarios?correo=...` | `services/api.js` y `hooks/usePlatos.js` usan `async/await`, `AbortController`, control de `response.ok` y estados de carga/error/404. |
| **Axios** | `POST /pedidos`, `DELETE /pedidos/:id` | Instancia con `baseURL`, timeout e interceptor de errores HTTP (`ErrorHttp`) para crear y cancelar órdenes reales. |
| **Alova** | `GET /pedidos?usuarioId=...` | `hooks/usePedidos.js` usa `useRequest` con caché en memoria (30s), invalidación al crear/cancelar, botón **Actualizar pedidos** y resumen con `pedidosPorEstado`. |

* **Servidor personalizado (`api-mock/server.mjs`):**
  * En `POST /pedidos`: verifica que el plato exista (`404`) y esté `disponible` (`409`), valida con `validarPedido` (`400`) y genera el código `PED-XXXX` en el servidor usando `crearGeneradorCodigos`.
  * En `PATCH /pedidos/:id` y `DELETE /pedidos/:id`: valida transiciones (`aprobada` / `rechazada`) solo sobre pedidos `pendiente` (retorna `409` si ya fue atendido).
* **Actualización en Angular Admin:** `pedido-list` ahora aprueba (`En Preparación`) o rechaza pedidos reales vía `PATCH /pedidos/:id`, sincronizando inmediatamente con React, Vue y Next.js.

---

## Avance 4 – Kiosko Vue 3 y Portal Público SSR con Next.js (Semana 16)

Dos aplicaciones públicas adicionales sobre el mismo contrato REST (`http://localhost:3000`) con diseño y tema claro/oscuro persistente unificados:

### 1. Kiosko de Cafetería en Vue 3 (`vue-kiosko` · Puerto 5174)
* **Arquitectura:** Vite + Vue 3 con **Options API** (`data`, `computed`, `methods`, `mounted`, `beforeUnmount`), refresco automático cada **30 segundos** (`setInterval` + limpieza en `beforeUnmount`) y filtro por **fecha** (*Hoy* / *Todas las fechas*).
* **Componentes interactivos:**
  * `MonitorPedidos.vue`: Pantalla en vivo de órdenes (columna **Por confirmar en cocina** y columna **En preparación / Listos en mostrador** con códigos `PED-XXXX`).
  * `GrillaDisponibilidad.vue` (padre) + `CeldaHorario.vue` (hijo con `props` y `$emit('ver-detalle')`): Matriz bidimensional por los **3 turnos reales de cafetería** (`☕ Desayuno 07:30–11:30`, `🍽️ Almuerzo 12:00–15:30`, `🌆 Tarde / Café 16:00–20:00`) reutilizando `Plato` y `categoriasUnicas` de `core-js`.
* **Estados realistas por celda (`v-bind:class`):**
  * 🟢 **Disponible:** Plato disponible en su turno de servicio.
  * 🟡 **N porc. en cocina:** Porciones actualmente en preparación/cola en ese turno.
  * 🔴 **Agotado / Tope lleno:** Plato agotado o capacidad de cocina alcanzada en el turno.
  * ⚪ **Fuera de turno:** Plato que no corresponde a ese horario (ej. almuerzos en desayuno).
* **Interactividad:** Filtro por categoría con `v-model` y modal de detalle (`v-if`) con ingredientes y órdenes del turno.

### 2. Portal Público SSR en Next.js (`next-publico` · Puerto 3001)
* **Arquitectura:** Next.js App Router con **Server-Side Rendering (`dynamic = 'force-dynamic'`, `cache: 'no-store'`)** y `generateMetadata` dinámico para SEO.
* **Rutas públicas:**
  * `/`: Inicio SSR con métricas del menú y tarjetas de categorías enlazadas al catálogo filtrado.
  * `/platos`: Catálogo SSR con filtro por categoría vía `searchParams` (`?categoria=...`) y `categoriasUnicas` de `core-js`.
  * `/platos/[id]`: Ficha pública SSR con ingredientes, horario de servicio, preparación y resumen anónimo de popularidad (sin exponer pedidos de otros clientes).
  * `/pedidos/buscar` y `/pedidos/redireccionar`: Búsqueda pública de orden con redirección en servidor (`redirect`).
  * `/pedidos/[codigo]`: Seguimiento SSR validando formato con `esCodigoPedido` de `core-js`, mostrando estado, fecha y hora de recojo, y vista de no encontrado si no existe.
* **Tema persistente sin parpadeo:** Script inicial en `app/layout.js` + `NavbarPublico.js` (`localStorage`), manteniendo el modo oscuro incluso tras búsquedas y redirecciones SSR.

---

## Cuadro Comparativo de Frameworks

| Criterio | Angular (`angular-admin`) | React 19 (`react-estudiante`) | Vue 3 (`vue-kiosko`) | Next.js (`next-publico`) |
| :--- | :--- | :--- | :--- | :--- |
| **Curva de aprendizaje** | Alta (TypeScript, DI, Decoradores, RxJS, Signals). | Media (JS moderno, JSX y reglas de Hooks). | Baja / Progresiva (SFC `.vue` y Options API clara). | Media-Baja viniendo de React (App Router y Server Components). |
| **Manejo del estado** | Servicios inyectables con `Signals` y `RxJS`. | `useState`, `useContext` y caché HTTP con `Alova`. | Reactividad nativa (`data`, `computed`). | Server Components sin estado + `'use client'` puntual. |
| **Enrutamiento** | `@angular/router` configurado en `app.routes.ts`. | `react-router-dom` declarativo con rutas protegidas. | Vista única de kiosko con filtros y modal reactivo. | File-system routing en `app/` (`[id]`, `[codigo]`). |
| **Renderizado** | Client-Side Rendering (CSR). | Client-Side Rendering (CSR) con Vite. | Client-Side Rendering (CSR) con polling cada 30s. | Server-Side Rendering (SSR) bajo demanda con SEO. |
| **Caso de uso en FoodCampus** | Panel administrativo privado (CRUD y estados). | Portal interactivo del estudiante autenticado. | Pantalla pública de turnos y órdenes en cafetería. | Web pública indexable para carta y rastreo de tickets. |

---

## Reglas de Negocio Implementadas

1. **Identidad institucional:** Correos `@utp.edu.pe` y códigos `U` + 8 dígitos (`validadores.js`).
2. **Códigos de pedido:** Formato `PED-XXXX` generado con closure en `api-mock/server.mjs`.
3. **Consistencia financiera:** `precioTotal = cantidad * precioUnitario` validado en cliente y servidor.
4. **Disponibilidad real:** No se permiten pedidos de platos `agotado` (validado en UI y en `POST /pedidos`).
5. **Consistencia de horarios:** Bloqueo de órdenes duplicadas en la misma fecha/hora por estudiante y turnos reales de servicio en el kiosko.

---

## Declaración de Uso de IA

En cumplimiento de la Sección 13 del Proyecto Integral:
* Se utilizaron asistentes de IA para apoyo en análisis arquitectural, refactorización, pruebas y verificación de las rúbricas de los Avances 1 al 4.
* Todos los integrantes del grupo comprenden y están en capacidad de explicar, modificar y sustentar línea por línea el código de cada módulo.
