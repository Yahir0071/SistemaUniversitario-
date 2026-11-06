# FoodCampus – Proyecto Integral (JavaScript Avanzado)

**Repositorio:** [https://github.com/Yahir0071/SistemaUniversitario-](https://github.com/Yahir0071/SistemaUniversitario-)  
**Dominio:** FoodCampus (Gestión de Menú, Platos y Pedidos de Cafetería Universitaria)  

## Integrantes del Grupo
| N° | Nombre Completo | Código UTP | Rol / Responsabilidad en Avance 1 |
|:--:|:----------------|:----------:|:----------------------------------|
| 1  | Yahir Anthony Huaira Yauri | U24253852 | `core-js` (Validadores, Modelos, Estadísticas) y Catálogo de Platos Angular |
| 2  | Angello Gabriel Enciso Abril | U24257462 | `api-mock` (db.json, endpoints json-server) y Colección Postman |
| 3  | Mathias Sebastián Loreto Peñaranda | U24223538 | `angular-admin` (Routing, Servicios Plato/Pedido, Interfaces) |
| 4  | Esaul Ronaldo Chancan Moreno | U24233179 | `angular-admin` (Gestión de Pedidos, Pipes, Directivas y UI Bootstrap) |
| 5  | Jeferson Alonso Almerco Ramirez | U23249977 | `readme.md` Documentación y Pruebas Generales (QA) |

---

## Avance 1 – Guía de Ejecución

> **Importante:** Para que el frontend Angular funcione correctamente, deben mantenerse abiertas **dos terminales**: una para la API REST simulada y otra para la aplicación Angular.

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

### 3. Panel Administrativo Angular (Puerto 4200)
```bash
cd angular-admin
npm install # o npm ci
npm run sync-core
npm start
```
*Abre la aplicación en `http://localhost:4200` conectada al API de `http://localhost:3000`.*

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

---

## Declaración de Uso de IA
En cumplimiento de la Sección 13 del Proyecto Integral:
* Se utilizaron asistentes de IA como soporte de análisis arquitectural, verificación de cobertura de pruebas unitarias y generación de plantillas de componentes.
* Todos los integrantes del grupo comprenden y están en capacidad de explicar, modificar y sustentar línea por línea el código presentado en cada módulo.
