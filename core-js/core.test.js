// node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esCorreoUTP, esCodigoAlumno, esHora, esFecha, validarReserva, validarLaboratorio } from './validadores.js';
import { Reserva, Laboratorio, Usuario } from './modelos.js';
import {
  reservasPorEstado,
  ocupacionPorLaboratorio,
  sedesUnicas,
  rankingLaboratorios,
  crearGeneradorCodigos,
} from './estadisticas.js';

const base = { laboratorioId: 1, fecha: '2026-11-20' };
const res = (ini, fin, extra = {}) => new Reserva({ ...base, horaInicio: ini, horaFin: fin, ...extra });

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

test('validarReserva reporta horaFin <= horaInicio con mensaje', () => {
  const errores = validarReserva({ ...base, usuarioId: 3, horaInicio: '10:00', horaFin: '09:00' });
  assert.equal(errores.length, 1);
  assert.match(errores[0], /debe ser mayor/);
});

test('validarLaboratorio rechaza capacidad fuera de 1-60', () => {
  const lab = { nombre: 'Lab A-1', sede: 'Lima', capacidad: 61, equipos: [], estado: 'disponible' };
  assert.equal(validarLaboratorio(lab).length, 1);
  assert.equal(validarLaboratorio({ ...lab, capacidad: 60 }).length, 0);
});

test('duracionHoras calcula horas con fracciones', () => {
  assert.equal(res('08:00', '10:30').duracionHoras(), 2.5);
});

test('reservas contiguas no se cruzan', () => {
  assert.equal(res('08:00', '10:00').seCruzaCon(res('10:00', '11:00')), false);
});

test('solapadas del mismo lab se cruzan; en otro lab o día no', () => {
  assert.equal(res('08:00', '10:00').seCruzaCon(res('09:00', '11:00')), true);
  assert.equal(res('08:00', '10:00').seCruzaCon(res('09:00', '11:00', { laboratorioId: 2 })), false);
  assert.equal(res('08:00', '10:00').seCruzaCon(res('09:00', '11:00', { fecha: '2026-11-21' })), false);
});

test('clases: getters y métodos propios', () => {
  const lab = new Laboratorio({ nombre: 'L', sede: 'S', capacidad: 5, equipos: ['PC i7'], estado: 'mantenimiento' });
  assert.equal(lab.estaDisponible, false);
  assert.equal(lab.tieneEquipo('pc'), true);
  const u = new Usuario({ nombre: 'Ana Torres', rol: 'admin', password: 'x' });
  assert.equal(u.esAdmin, true);
  assert.equal('password' in u.perfilPublico(), false);
});

test('reservasPorEstado cuenta con reduce', () => {
  const r = [{ estado: 'aprobada' }, { estado: 'aprobada' }, { estado: 'pendiente' }];
  assert.deepEqual(reservasPorEstado(r), { pendiente: 1, aprobada: 2, rechazada: 0 });
});

test('ocupación (Map), sedes únicas (Set) y ranking', () => {
  const reservas = [
    { laboratorioId: 1, fecha: 'a', horaInicio: '08:00', horaFin: '10:00', estado: 'aprobada' },
    { laboratorioId: 1, fecha: 'b', horaInicio: '08:00', horaFin: '09:00', estado: 'pendiente' },
    { laboratorioId: 2, fecha: 'a', horaInicio: '08:00', horaFin: '12:00', estado: 'rechazada' },
  ];
  assert.equal(ocupacionPorLaboratorio(reservas).get(1), 3);
  assert.equal(ocupacionPorLaboratorio(reservas).has(2), false);
  assert.deepEqual(sedesUnicas([{ sede: 'Lima' }, { sede: 'Lima' }, { sede: 'Sur' }]), ['Lima', 'Sur']);
  assert.deepEqual(rankingLaboratorios(reservas)[0], { laboratorioId: 1, total: 2 });
});

test('generador de códigos con closure', () => {
  const next = crearGeneradorCodigos();
  assert.equal(next(), 'RES-0001');
  assert.equal(next(), 'RES-0002');
  assert.equal(crearGeneradorCodigos('RES', 20)(), 'RES-0021');
});
