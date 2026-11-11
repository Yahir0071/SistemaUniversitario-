import { createContext, useContext, useState } from 'react';
import db from '../data/db.json';
import { Usuario } from '../core/modelos.js';
import { esCorreoUTP } from '../core/validadores.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'foodcampus_usuario';

function leerSesionGuardada() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada);

  const login = (correo, password) => {
    const correoLimpio = correo.trim().toLowerCase();
    if (!esCorreoUTP(correoLimpio)) {
      return { ok: false, error: 'Ingresa un correo institucional válido (@utp.edu.pe).' };
    }

    const encontrado = db.usuarios.find(
      (u) => u.correo.toLowerCase() === correoLimpio && u.password === password
    );

    if (!encontrado) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    const perfil = new Usuario(encontrado).perfilPublico();
    setUsuario(perfil);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(perfil));
    } catch {
      // Ignorar error de almacenamiento
    }
    return { ok: true, usuario: perfil };
  };

  const logout = () => {
    setUsuario(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
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
