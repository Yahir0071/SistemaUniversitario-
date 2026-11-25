import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { Pedido } from '../core/modelos.js';
import { API_URL, api, leerRespuesta } from './api.js';

const alova = createAlova({
  baseURL: API_URL,
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: leerRespuesta,
  timeout: 10000,
});

export function consultarPedidos(usuarioId) {
  return alova.Get('/pedidos', {
    params: { usuarioId, _sort: 'id', _order: 'desc' },
    cacheFor: 30_000,
    cache: 'no-store',
  });
}

export async function crearPedido(usuarioId, datos) {
  const modelo = new Pedido({ ...datos, usuarioId, creadoEn: new Date().toISOString() });
  const { data: creado } = await api.post('/pedidos', {
    ...modelo,
    hora: datos.hora,
    precioTotal: modelo.precioTotal,
  });
  return creado;
}

export async function cancelarPedido(id) {
  await api.delete(`/pedidos/${encodeURIComponent(id)}`);
}
