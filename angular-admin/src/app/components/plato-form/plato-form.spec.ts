import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PlatoForm } from './plato-form';

describe('PlatoForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoForm],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  it('debe crear el formulario de platos', () => {
    const fixture = TestBed.createComponent(PlatoForm);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
