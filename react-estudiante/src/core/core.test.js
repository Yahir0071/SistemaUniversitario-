// node --test para FoodCampus
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  esCorreoUTP,
  esCodigoAlumno,
  esHora,
  esFecha,
  esCodigoPedido,
  validarPlato,
  validarPedido,
} from './validadores.js';
import { Plato, Pedido, Usuario } from './modelos.js';
import {
  pedidosPorEstado,
  ventasPorPlato,
  categoriasUnicas,
  rankingPlatos,
  crearGeneradorCodigos,
} from './estadisticas.js';

test('correo institucional válido e inválido', () => {
  assert.equal(esCorreoUTP('u20231234@utp.edu.pe'), true);
  assert.equal(esCorreoUTP('alguien@gmail.com'), false);
});

test('código de alumno: U + 8 dígitos', () => {
  assert.equal(esCodigoAlumno('U20231234'), true);
  assert.equal(esCodigoAlumno('U2023123'), false);
  assert.equal(esCodigoAlumno('A20231234'), false);
});

test('hora HH:mm y fecha AAAA-MM-DD', () => {
  assert.equal(esHora('08:30'), true);
  assert.equal(esHora('24:00'), false);
  assert.equal(esFecha('2026-11-20'), true);
  assert.equal(esFecha('2026-02-31'), false);
});

test('código de pedido con formato PED-0001', () => {
  assert.equal(esCodigoPedido('PED-0001'), true);
  assert.equal(esCodigoPedido('PED-9999'), true);
  assert.equal(esCodigoPedido('RES-0001'), false);
});

test('validarPlato rechaza precio inválido o fuera de rango (1-100)', () => {
  const platoInvalido = { nombre: 'Lomo', categoria: 'Almuerzos', precio: 150, ingredientes: [], estado: 'disponible' };
  assert.equal(validarPlato(platoInvalido).length, 1);
  assert.equal(validarPlato({ ...platoInvalido, precio: 15.5 }).length, 0);
});

test('validarPedido verifica regla de negocio: precioTotal = cantidad * precioUnitario', () => {
  const ped = {
    fecha: '2026-11-20',
    platoId: 1,
    usuarioId: 3,
    cantidad: 2,
    precioUnitario: 14.5,
    precioTotal: 25.0, // error: debe ser 29.0
  };
  const errores = validarPedido(ped);
  assert.equal(errores.length, 1);
  assert.match(errores[0], /no coincide/);
});

test('Plato: getters y métodos propios', () => {
  const p = new Plato({
    nombre: 'Lomo Saltado',
    categoria: 'Almuerzos',
    precio: 14.5,
    ingredientes: ['Carne', 'Papas'],
    estado: 'agotado',
  });
  assert.equal(p.estaDisponible, false);
  assert.equal(p.tieneIngrediente('carne'), true);
  assert.equal(p.tieneIngrediente('pescado'), false);
});

test('Pedido: calcula precioTotal con regla de negocio', () => {
  const ped = new Pedido({ platoId: 1, cantidad: 3, precioUnitario: 12.5 });
  assert.equal(ped.precioTotal, 37.5);
  assert.equal(ped.estaActivo, true);
});

test('Usuario: getters y métodos propios', () => {
  const u = new Usuario({ nombre: 'Ana Torres', correo: 'admin@utp.edu.pe', rol: 'admin', password: 'x' });
  assert.equal(u.esAdmin, true);
  assert.equal(u.iniciales, 'AT');
  assert.equal('password' in u.perfilPublico(), false);
});

test('pedidosPorEstado cuenta con reduce', () => {
  const lista = [{ estado: 'aprobada' }, { estado: 'aprobada' }, { estado: 'pendiente' }];
  assert.deepEqual(pedidosPorEstado(lista), { pendiente: 1, aprobada: 2, rechazada: 0 });
});

test('ventasPorPlato (Map), categoriasUnicas (Set) y rankingPlatos', () => {
  const pedidos = [
    { platoId: 1, cantidad: 2, precioUnitario: 10, estado: 'aprobada' },
    { platoId: 1, cantidad: 1, precioUnitario: 10, estado: 'pendiente' },
    { platoId: 2, cantidad: 5, precioUnitario: 8, estado: 'rechazada' },
  ];
  const mapaVentas = ventasPorPlato(pedidos);
  assert.equal(mapaVentas.get(1), 30);
  assert.equal(mapaVentas.has(2), false);

  const platos = [{ categoria: 'Almuerzos' }, { categoria: 'Almuerzos' }, { categoria: 'Bebidas' }];
  assert.deepEqual(categoriasUnicas(platos), ['Almuerzos', 'Bebidas']);

  const ranking = rankingPlatos(pedidos);
  assert.deepEqual(ranking[0], { platoId: 1, cantidad: 3 });
});

test('generador de códigos PED con closure', () => {
  const gen = crearGeneradorCodigos('PED');
  assert.equal(gen(), 'PED-0001');
  assert.equal(gen(), 'PED-0002');
  assert.equal(crearGeneradorCodigos('PED', 20)(), 'PED-0021');
});
