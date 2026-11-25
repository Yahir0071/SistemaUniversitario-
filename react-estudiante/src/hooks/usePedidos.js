import { useRef, useState } from 'react';
import { invalidateCache } from 'alova';
import { useRequest } from 'alova/client';
import { pedidosPorEstado } from '../core/estadisticas.js';
import { consultarPedidos, crearPedido, cancelarPedido } from '../services/pedidos.js';
import { ErrorHttp } from '../services/api.js';

export function usePedidos(usuarioId) {
  const { data, loading, error, send, update } = useRequest(
    () => consultarPedidos(usuarioId),
    { immediate: usuarioId != null, force: ({ args }) => args[0] === true }
  );
  const [guardando, setGuardando] = useState(false);
  const mutacionActiva = useRef(false);
  // La API simulada admite filtros, pero el portal también verifica la pertenencia.
  const datos = data?.filter((pedido) => String(pedido.usuarioId) === String(usuarioId)) ?? [];

  async function actualizar() {
    if (usuarioId == null || mutacionActiva.current || loading) return;
    await send(true).catch(() => {});
  }

  async function guardar(operacion) {
    if (usuarioId == null || mutacionActiva.current || loading) {
      throw new Error('Espera a que termine la operación actual.');
    }
    mutacionActiva.current = true;
    setGuardando(true);
    try {
      return await operacion();
    } finally {
      mutacionActiva.current = false;
      setGuardando(false);
    }
  }

  const crear = (pedido) => guardar(async () => {
    const creado = await crearPedido(usuarioId, pedido);
    invalidateCache(consultarPedidos(usuarioId));
    update({ data: [creado, ...datos] });
    return creado;
  });

  const cancelar = (id) => guardar(async () => {
    await cancelarPedido(id);
    invalidateCache(consultarPedidos(usuarioId));
    update({ data: datos.filter((pedido) => pedido.id !== id) });
  });

  return {
    datos,
    resumen: pedidosPorEstado(datos),
    cargando: loading,
    error: error instanceof ErrorHttp ? error.message : error && 'No se pudieron consultar tus pedidos. Comprueba que la API esté en ejecución.',
    guardando,
    actualizar,
    crear,
    cancelar,
  };
}
