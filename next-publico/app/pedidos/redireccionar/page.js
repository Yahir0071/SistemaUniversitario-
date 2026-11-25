import { redirect } from 'next/navigation';

export default async function RedireccionarPage({ searchParams }) {
  const { codigo } = await searchParams;
  const codigoLimpio = (codigo || '').trim().toUpperCase();
  if (!codigoLimpio) {
    redirect('/pedidos/buscar');
  }
  redirect(`/pedidos/${codigoLimpio}`);
}
