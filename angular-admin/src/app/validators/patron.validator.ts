import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador propio basado en expresión regular: "Lab A-301"
const NOMBRE_LAB = /^Lab [A-Z]-\d{3}$/;

export const nombreLaboratorioValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const valor = (c.value ?? '') as string;
  if (!valor) return null; // required se encarga del vacío
  return NOMBRE_LAB.test(valor) ? null : { nombreLab: { esperado: 'Lab A-301', actual: valor } };
};
