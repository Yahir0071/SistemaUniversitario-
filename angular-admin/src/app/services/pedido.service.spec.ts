import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PedidoService } from './pedido.service';

describe('PedidoService', () => {
  let service: PedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(PedidoService);
  });

  it('debe inicializarse el servicio de pedidos', () => {
    expect(service).toBeTruthy();
  });
});
