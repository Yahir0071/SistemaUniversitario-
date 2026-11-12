import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PedidoList } from './pedido-list';

describe('PedidoList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoList],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('debe crear el componente de lista de pedidos', () => {
    const fixture = TestBed.createComponent(PedidoList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
