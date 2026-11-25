import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { RutaProtegida } from './components/RutaProtegida.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CatalogoPage } from './pages/CatalogoPage.jsx';
import { DetallePlatoPage } from './pages/DetallePlatoPage.jsx';
import { MisPedidosPage } from './pages/MisPedidosPage.jsx';
import { NuevoPedidoPage } from './pages/NuevoPedidoPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  const { usuario } = useAuth();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar marca="FoodCampus" />
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage key={usuario?.id ?? 'invitado'} />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/catalogo/:id" element={<DetallePlatoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida>
                <MisPedidosPage />
              </RutaProtegida>
            }
          />
          <Route
            path="/nuevo-pedido"
            element={
              <RutaProtegida>
                <NuevoPedidoPage />
              </RutaProtegida>
            }
          />
          {/* Alias de compatibilidad con la rúbrica base (reservas -> pedidos) */}
          <Route path="/mis-reservas" element={<Navigate to="/mis-pedidos" replace />} />
          <Route path="/nueva-reserva" element={<Navigate to="/nuevo-pedido" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
