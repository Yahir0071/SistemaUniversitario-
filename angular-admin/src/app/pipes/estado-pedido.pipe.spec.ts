import { EstadoPedidoPipe } from './estado-pedido.pipe';

describe('EstadoPedidoPipe', () => {
  it('debe crear una instancia del pipe', () => {
    const pipe = new EstadoPedidoPipe();
    expect(pipe).toBeTruthy();
  });

  it('debe transformar estado pendiente con icono', () => {
    const pipe = new EstadoPedidoPipe();
    expect(pipe.transform('pendiente')).toBe('⏳ Pendiente');
  });
});
