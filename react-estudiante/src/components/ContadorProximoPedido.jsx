import { useEffect, useState } from 'react';
import { Pedido } from '../core/modelos.js';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';

function formatearRestante(ms) {
  if (ms <= 0) return '¡Tu pedido ya está por entregarse!';
  const totalSeg = Math.floor(ms / 1000);
  const dias = Math.floor(totalSeg / 86400);
  const horas = Math.floor((totalSeg % 86400) / 3600);
  const mins = Math.floor((totalSeg % 3600) / 60);
  const segs = totalSeg % 60;
  return `${dias}d ${String(horas).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(segs).padStart(2, '0')}s`;
}

export function ContadorProximoPedido({ pedidos, platos = [] }) {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const proximo = pedidos
    .filter((p) => new Pedido(p).estaActivo)
    .map((p) => ({
      ...p,
      timestamp: new Date(`${p.fecha}T${obtenerHoraPedido(p)}:00`).getTime(),
    }))
    .filter((p) => !Number.isNaN(p.timestamp) && p.timestamp > ahora)
    .sort((a, b) => a.timestamp - b.timestamp)[0];

  if (!proximo) {
    return (
      <div className="alert alert-secondary mb-3">
        No tienes próximos pedidos programados por recoger.
      </div>
    );
  }

  const plato = platos.find((pl) => Number(pl.id) === Number(proximo.platoId));

  return (
    <div className="alert alert-primary d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <strong>Próximo pedido ({proximo.codigo}):</strong>{' '}
        {plato ? plato.nombre : `Plato #${proximo.platoId}`} — {proximo.fecha} a las{' '}
        {obtenerHoraPedido(proximo)}
      </div>
      <span className="badge text-bg-dark fs-6 font-monospace">
        ⏱ {formatearRestante(proximo.timestamp - ahora)}
      </span>
    </div>
  );
}
