import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PlatoList } from './plato-list';

describe('PlatoList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoList],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  it('debe crear el componente de lista de platos', () => {
    const fixture = TestBed.createComponent(PlatoList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
