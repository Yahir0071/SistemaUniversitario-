const ESTILOS = {
  disponible: { clase: 'text-bg-success', texto: 'Disponible' },
  agotado: { clase: 'text-bg-warning', texto: 'Agotado' },
  pendiente: { clase: 'text-bg-warning', texto: '⏳ Pendiente' },
  aprobada: { clase: 'text-bg-success', texto: '👨‍🍳 En preparación' },
  rechazada: { clase: 'text-bg-danger', texto: '❌ Cancelado' },
};

export function BadgeEstado({ estado }) {
  const config = ESTILOS[estado] ?? { clase: 'text-bg-secondary', texto: estado };
  return <span className={`badge ${config.clase}`}>{config.texto}</span>;
}
