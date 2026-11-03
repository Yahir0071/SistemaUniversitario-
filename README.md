# CampusHub – Proyecto Integral (JavaScript Avanzado)

**Repositorio:** [https://github.com/Yahir0071/SistemaUniversitario-](https://github.com/Yahir0071/SistemaUniversitario-)  
**Dominio:** CampusHub Labs (Laboratorios / Reservas)  

## Integrantes del Grupo
| N° | Nombre Completo | Código UTP | Rol / Responsabilidad en Avance 1 |
|:--:|:----------------|:----------:|:----------------------------------|
| 1  | [Nombre Integrante 1] | UXXXXXXXX | `core-js` (Validadores, Modelos, Estadísticas y Tests) |
| 2  | [Nombre Integrante 2] | UXXXXXXXX | `api-mock` (db.json, endpoints y json-server) |
| 3  | [Nombre Integrante 3] | UXXXXXXXX | `angular-admin` (Routing, Servicios HttpClient, Interfaces y sync-core) |
| 4  | [Nombre Integrante 4] | UXXXXXXXX | `angular-admin` (Componentes Catálogo: List, Form, Detail y validaciones) |
| 5  | [Nombre Integrante 5] | UXXXXXXXX | `angular-admin` (Reservas, Pipes, Directivas, Bootstrap y Documentación) |

---

## Avance 1 – Guía de Ejecución

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
*Levanta `json-server` en `http://localhost:3000` con persistencia en `db.json`.*

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

Incluye pruebas para los 5 métodos HTTP:
* `GET /laboratorios` (con soporte para filtros `?sede=` y `?q=`)
* `GET /laboratorios/:id`
* `POST /laboratorios`
* `PUT /laboratorios/:id`
* `DELETE /laboratorios/:id`
* `GET /reservas?usuarioId=`
* `POST /reservas`
* `DELETE /reservas/:id`

---

## Declaración de Uso de IA
En cumplimiento de la Sección 13 del Proyecto Integral:
* Se utilizaron asistentes de IA como soporte de análisis arquitectural, verificación de cobertura de pruebas unitarias y generación de plantillas de componentes.
* Todos los integrantes del grupo comprenden y están en capacidad de explicar, modificar y sustentar línea por línea el código presentado en cada módulo.

