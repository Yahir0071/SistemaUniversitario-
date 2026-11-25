import jsonServer from 'json-server';
import { crearGeneradorCodigos } from '../core-js/estadisticas.js';

const servidor = jsonServer.create();
const router = jsonServer.router(process.env.FOODCAMPUS_DB ?? 'db.json');
const ultimoCodigo = router.db.get('pedidos').value().reduce((maximo, pedido) => {
  const coincidencia = /^PED-(\d+)$/.exec(pedido.codigo);
  return coincidencia ? Math.max(maximo, Number(coincidencia[1])) : maximo;
}, 0);
const siguienteCodigo = crearGeneradorCodigos('PED', ultimoCodigo);

servidor.use(jsonServer.defaults());
servidor.use(jsonServer.bodyParser);
servidor.post('/pedidos', (req, _res, next) => {
  req.body.codigo = siguienteCodigo();
  next();
});

function verificarPedidoPendiente(req, res, next) {
  const pedido = router.db.get('pedidos').find((actual) => String(actual.id) === req.params.id).value();
  if (pedido && pedido.estado !== 'pendiente') {
    return res.status(409).json({ error: 'El pedido ya no está pendiente.' });
  }
  next();
}

servidor.patch('/pedidos/:id', (req, res, next) => {
  if (!Object.hasOwn(req.body, 'estado')) return next();
  if (req.body.estado !== 'aprobada' && req.body.estado !== 'rechazada') {
    return res.status(400).json({ error: 'El nuevo estado debe ser aprobada o rechazada.' });
  }
  return verificarPedidoPendiente(req, res, next);
});
servidor.delete('/pedidos/:id', verificarPedidoPendiente);
servidor.use(router);

const puerto = Number(process.env.FOODCAMPUS_PORT ?? 3000);
servidor.listen(puerto, () => console.log(`API de FoodCampus en http://localhost:${puerto}`));
