const ESTILOS = {
  disponible: { clase: 'bg-success text-white', texto: 'Disponible', dot: '● ' },
  agotado: { clase: 'bg-secondary text-white', texto: 'Agotado', dot: '○ ' },
  pendiente: { clase: 'bg-warning text-dark', texto: '⏳ Pendiente', dot: '' },
  aprobada: { clase: 'bg-success text-white', texto: '👨‍🍳 En preparación', dot: '' },
  rechazada: { clase: 'bg-danger text-white', texto: '❌ Cancelado', dot: '' },
};

export function BadgeEstado({ estado }) {
  const config = ESTILOS[estado] ?? { clase: 'bg-secondary text-white', texto: estado, dot: '' };
  return (
    <span className={`badge rounded-pill px-2 py-1 fw-semibold ${config.clase}`}>
      {config.dot}{config.texto}
    </span>
  );
}
