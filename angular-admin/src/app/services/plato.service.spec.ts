import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PlatoService } from './plato.service';

describe('PlatoService', () => {
  let service: PlatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(PlatoService);
  });

  it('debe inicializarse el servicio de platos', () => {
    expect(service).toBeTruthy();
  });
});
