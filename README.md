# FoodCampus – Proyecto Integral (JavaScript Avanzado)

**Repositorio:** [https://github.com/Yahir0071/SistemaUniversitario-](https://github.com/Yahir0071/SistemaUniversitario-)  
**Dominio:** FoodCampus (Gestión de Menú, Platos y Pedidos de Cafetería Universitaria)  

## Integrantes del Grupo
| N° | Nombre Completo | Código UTP | Rol / Responsabilidad en Avance 1 y 2 |
|:--:|:----------------|:----------:|:--------------------------------------|
| 1  | Yahir Anthony Huaira Yauri | U24253852 | `core-js` (Validadores, Modelos, Estadísticas), Catálogo de Platos Angular y Portal React |
| 2  | Angello Gabriel Enciso Abril | U24257462 | `api-mock` (db.json, endpoints json-server) y Colección Postman |
| 3  | Mathias Sebastián Loreto Peñaranda | U24223538 | `angular-admin` (Routing, Servicios Plato/Pedido, Interfaces) |
| 4  | Esaul Ronaldo Chancan Moreno | U24233179 | `angular-admin` (Gestión de Pedidos, Pipes, Directivas y UI Bootstrap) |
| 5  | Jeferson Alonso Almerco Ramirez | U23249977 | `readme.md` Documentación y Pruebas Generales (QA) |

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

### 4. Portal del Estudiante React + Vite (Puerto 5173) – Avance 2
> **Nota de Avance 2:** En esta fase los datos son locales (copia importada de `db.json`); no requiere conexión externa obligatoria para navegar el catálogo y simular pedidos.

```bash
cd react-estudiante
npm install # o npm ci
npm run sync-core # sincroniza lógica y validadores de core-js
npm run sync-data # sincroniza datos iniciales de db.json
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
5. **Consistencia de Horarios en Pedidos (Avance 2):** Un estudiante no puede tener dos pedidos activos programados para la misma fecha y hora de recojo.

---

## Declaración de Uso de IA
En cumplimiento de la Sección 13 del Proyecto Integral:
* Se utilizaron asistentes de IA como soporte de análisis arquitectural, verificación de cobertura de pruebas unitarias y generación de plantillas de componentes.
* Todos los integrantes del grupo comprenden y están en capacidad de explicar, modificar y sustentar línea por línea el código presentado en cada módulo.
