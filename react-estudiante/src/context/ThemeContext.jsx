import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'foodcampus_theme';

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema);
    document.documentElement.classList.toggle('dark', tema === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, tema);
    } catch {
      // Ignorar si almacenamiento local no está disponible
    }
  }, [tema]);

  const alternarTema = () => setTema((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ tema, esOscuro: tema === 'dark', alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
