// map / filter / reduce, Map y Set para FoodCampus (S2, S4, S5)
import { Pedido } from './modelos.js';

// reduce con valor inicial objeto: el acumulador es un contador por estado
export const pedidosPorEstado = (pedidos) =>
  pedidos.reduce(
    (acc, p) => ({ ...acc, [p.estado]: (acc[p.estado] ?? 0) + 1 }),
    { pendiente: 0, aprobada: 0, rechazada: 0 }
  );

// Map platoId -> total recaudado en S/. (no cuenta los pedidos rechazados)
export const ventasPorPlato = (pedidos) => {
  const mapa = new Map();
  pedidos
    .filter((p) => p.estado !== 'rechazada')
    .forEach((p) => {
      const total = new Pedido(p).precioTotal;
      mapa.set(p.platoId, Math.round(((mapa.get(p.platoId) ?? 0) + total) * 100) / 100);
    });
  return mapa;
};

// Set elimina categorías duplicadas; spread lo vuelve arreglo
export const categoriasUnicas = (platos) => [...new Set(platos.map((p) => p.categoria))];

// Ranking: cuenta cantidad total pedida con Map y ordena con sort descendente
export const rankingPlatos = (pedidos) => {
  const conteo = new Map();
  for (const p of pedidos) {
    if (p.estado !== 'rechazada') {
      conteo.set(p.platoId, (conteo.get(p.platoId) ?? 0) + p.cantidad);
    }
  }
  return [...conteo]
    .map(([platoId, cantidad]) => ({ platoId, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.platoId - b.platoId);
};

// Closure: `n` queda privado en el ámbito léxico y persiste entre llamadas
export const crearGeneradorCodigos = (prefijo = 'PED', ultimo = 0) => {
  let n = ultimo;
  return () => `${prefijo}-${String(++n).padStart(4, '0')}`;
};
