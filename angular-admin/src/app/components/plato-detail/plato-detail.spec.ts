import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PlatoDetail } from './plato-detail';

describe('PlatoDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoDetail],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  it('debe crear el componente de detalle de plato', () => {
    const fixture = TestBed.createComponent(PlatoDetail);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
