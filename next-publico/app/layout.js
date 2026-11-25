import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import NavbarPublico from './components/NavbarPublico';

export const metadata = {
  title: 'FoodCampus - Portal Público SSR',
  description: 'Consulta pública del catálogo de platos y estado de pedidos de FoodCampus UTP sin iniciar sesión.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="d-flex flex-column min-vh-100">
        <NavbarPublico />

        <main className="flex-grow-1">
          {children}
        </main>

        <footer className="py-4 border-top text-center small text-muted-fc" style={{ borderColor: 'var(--line) !important' }}>
          <div className="container">
            FoodCampus SSR · Portal Público Universitario (Next.js App Router · Puerto 3001)
          </div>
        </footer>
      </body>
    </html>
  );
}
