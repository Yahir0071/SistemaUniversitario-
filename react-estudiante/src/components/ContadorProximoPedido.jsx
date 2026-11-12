import { useEffect, useState } from 'react';
import { Pedido } from '../core/modelos.js';
import { obtenerHoraPedido } from '../utils/pedidoValidation.js';
import { obtenerImagenPlato } from '../data/platosImagenes.js';

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
      <div className="card card-plato p-3 mb-3 text-body-secondary small">
        ℹ️ No tienes próximos pedidos pendientes de recojo.
      </div>
    );
  }

  const plato = platos.find((pl) => Number(pl.id) === Number(proximo.platoId));
  const imagenUrl = obtenerImagenPlato(proximo.platoId);

  return (
    <div className="card card-plato p-3 mb-4 d-flex flex-row flex-wrap justify-content-between align-items-center gap-3">
      <div className="d-flex align-items-center gap-3">
        <img src={imagenUrl} alt="" className="order-thumb" style={{ width: '48px', height: '48px' }} />
        <div>
          <span className="badge rounded-pill bg-warning text-dark px-2 py-1 mb-1 small">
            Próxima entrega: {proximo.codigo}
          </span>
          <div className="fw-semibold">
            {plato ? plato.nombre : `Plato #${proximo.platoId}`} — {proximo.fecha} ({obtenerHoraPedido(proximo)})
          </div>
        </div>
      </div>
      <div className="badge rounded-pill px-3 py-2 fs-6 font-monospace" style={{ backgroundColor: 'var(--fc-primary)', color: '#fff' }}>
        ⏱ {formatearRestante(proximo.timestamp - ahora)}
      </div>
    </div>
  );
}
