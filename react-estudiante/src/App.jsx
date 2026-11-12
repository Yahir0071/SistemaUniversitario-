import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import db from './data/db.json';
import { crearGeneradorCodigos } from './core/estadisticas.js';
import { Pedido } from './core/modelos.js';
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
import { obtenerHoraPedido } from './utils/pedidoValidation.js';

const pedidosIniciales = db.pedidos.map((p) => ({
  ...p,
  hora: obtenerHoraPedido(p),
}));

export default function App() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const { usuario } = useAuth();

  const agregarPedido = (datos) => {
    const maxCod = pedidos.reduce((max, p) => {
      const n = Number(String(p.codigo || '').replace('PED-', ''));
      return Number.isFinite(n) && n > max ? n : max;
    }, 0);
    const maxId = pedidos.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 0);
    const codigo = crearGeneradorCodigos('PED', maxCod)();

    const modelo = new Pedido({
      id: maxId + 1,
      codigo,
      usuarioId: usuario.id,
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
      ...datos,
    });

    const nuevo = { ...modelo, precioTotal: modelo.precioTotal, hora: datos.hora };
    setPedidos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const cancelarPedido = (id) => {
    setPedidos((prev) =>
      prev.map((p) => (Number(p.id) === Number(id) ? { ...p, estado: 'rechazada' } : p))
    );
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar marca="FoodCampus" />
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage pedidos={pedidos} />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/catalogo/:id" element={<DetallePlatoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida>
                <MisPedidosPage pedidos={pedidos} onCancelar={cancelarPedido} />
              </RutaProtegida>
            }
          />
          <Route
            path="/nuevo-pedido"
            element={
              <RutaProtegida>
                <NuevoPedidoPage pedidos={pedidos} onAgregar={agregarPedido} />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
