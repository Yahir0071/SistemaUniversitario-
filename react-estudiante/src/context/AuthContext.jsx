import { createContext, useContext, useState } from 'react';
import { consultar } from '../services/api.js';
import { Usuario } from '../core/modelos.js';
import { esCorreoUTP } from '../core/validadores.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'foodcampus_usuario';

function leerSesionGuardada() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada);

  const login = async (correo, password) => {
    const correoLimpio = correo.trim().toLowerCase();
    if (!esCorreoUTP(correoLimpio)) {
      return { ok: false, error: 'Ingresa un correo institucional válido (@utp.edu.pe).' };
    }

    let usuarios;
    try {
      usuarios = await consultar(`/usuarios?${new URLSearchParams({ correo: correoLimpio })}`);
    } catch {
      return { ok: false, error: 'No se pudo consultar la cuenta. Comprueba que la API esté en ejecución.' };
    }
    const encontrado = usuarios.find(
      (u) => u.correo.toLowerCase() === correoLimpio && u.password === password
    );

    if (!encontrado) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    const perfil = new Usuario(encontrado).perfilPublico();
    setUsuario(perfil);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(perfil));
    } catch {
      // Ignorar error de almacenamiento
    }
    return { ok: true, usuario: perfil };
  };

  const logout = () => {
    setUsuario(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignorar error de almacenamiento
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, estaAutenticado: Boolean(usuario), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
