const CONFIG = {
  disponible: { clase: 'status-disponible', texto: 'Disponible' },
  agotado: { clase: 'status-agotado', texto: 'Agotado' },
  pendiente: { clase: 'status-pendiente', texto: 'Pendiente' },
  aprobada: { clase: 'status-aprobada', texto: 'Listo para recoger' },
  rechazada: { clase: 'status-rechazada', texto: 'Cancelado' },
  entregado: { clase: 'status-entregado', texto: 'Entregado' },
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
