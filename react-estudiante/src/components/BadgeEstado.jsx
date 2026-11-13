const ESTILOS = {
  disponible: { bg: '#10b981', text: '#ffffff', label: 'Disponible', dot: '● ' },
  agotado: { bg: '#6b7280', text: '#ffffff', label: 'Agotado', dot: '○ ' },
  pendiente: { bg: '#f59e0b', text: '#1f160c', label: '⏳ Pendiente', dot: '' },
  aprobada: { bg: '#059669', text: '#ffffff', label: '👨‍🍳 En preparación', dot: '' },
  rechazada: { bg: '#dc2626', text: '#ffffff', label: '✕ Cancelado', dot: '' },
};

export function BadgeEstado({ estado }) {
  const cfg = ESTILOS[estado] ?? { bg: '#6b7280', text: '#ffffff', label: estado, dot: '' };

  return (
    <span
      className="badge rounded-pill px-2 py-1 fw-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text, fontSize: '0.75rem' }}
    >
      {cfg.dot}
      {cfg.label}
    </span>
  );
}
