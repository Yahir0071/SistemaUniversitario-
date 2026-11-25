import { useEffect, useState } from 'react';
import { consultar, ErrorHttp } from '../services/api.js';

export function usePlatos(id) {
  const ruta = id == null ? '/platos' : `/platos/${encodeURIComponent(id)}`;
  const [resultado, setResultado] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    async function cargar() {
      try {
        const datos = await consultar(ruta, controlador.signal);
        if (!controlador.signal.aborted) setResultado({ ruta, intento, datos });
      } catch (error) {
        if (controlador.signal.aborted) return;
        setResultado({ ruta, intento, error });
      }
    }
    cargar();
    return () => controlador.abort();
  }, [ruta, intento]);

  const actual = resultado?.ruta === ruta && resultado.intento === intento ? resultado : null;
  return {
    datos: actual?.datos ?? (id == null ? [] : null),
    cargando: actual === null,
    noEncontrado: actual?.error?.status === 404 && id != null,
    error: actual?.error instanceof ErrorHttp
      ? actual.error.message
      : actual?.error && 'No se pudo cargar el menú. Comprueba que la API esté en ejecución.',
    actualizar: () => setIntento((prev) => prev + 1),
  };
}
