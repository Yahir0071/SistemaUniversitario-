import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador propio basado en expresión regular: Nombre de plato inicia en mayúscula y tiene entre 3 y 40 caracteres
const PATRON_PLATO = /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]{2,40}$/;

export const nombrePlatoValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const valor = (c.value ?? '') as string;
  if (!valor) return null; // required se encarga del vacío
  return PATRON_PLATO.test(valor.trim())
    ? null
    : { nombrePlato: { esperado: 'Iniciar con mayúscula (mín. 3 caracteres)', actual: valor } };
};

// Validador propio para código de pedido: "PED-0001"
const PATRON_PEDIDO = /^PED-\d{4}$/;

export const codigoPedidoValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const valor = (c.value ?? '') as string;
  if (!valor) return null;
  return PATRON_PEDIDO.test(valor.trim()) ? null : { codigoPedido: { esperado: 'PED-0001', actual: valor } };
};
