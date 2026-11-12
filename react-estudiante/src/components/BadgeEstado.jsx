const CONFIG = {
  disponible: { clase: 'status-disponible', texto: 'Disponible' },
  agotado: { clase: 'status-agotado', texto: 'Agotado' },
  pendiente: { clase: 'status-pendiente', texto: 'Pendiente' },
  aprobada: { clase: 'status-aprobada', texto: 'En preparación' },
  rechazada: { clase: 'status-rechazada', texto: 'Cancelado' },
};

export function BadgeEstado({ estado }) {
  const c = CONFIG[estado] ?? { clase: 'status-pendiente', texto: estado };
  return (
    <span className={`status-pill ${c.clase}`}>
      <span className="status-dot" />
      {c.texto}
    </span>
  );
}
