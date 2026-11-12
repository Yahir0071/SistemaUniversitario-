export function CampoForm({ id, label, error, className = 'mb-3', children }) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
