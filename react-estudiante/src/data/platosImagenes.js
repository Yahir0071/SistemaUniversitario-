export const IMAGENES_PLATOS = {
  1: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lomo_saltado_peruano.jpg?width=800', // Lomo Saltado
  2: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aj%C3%AD_de_gallina_-_Tradicional.jpg?width=800', // Ají de Gallina
  3: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80', // Arroz Chaufa
  4: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', // Sándwich Mixto
  5: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', // Hamburguesa
  6: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80', // Ensalada César
  7: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80', // Jugo de Fresa
  8: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80', // Pie de Manzana
};

export function obtenerImagenPlato(id, urlOpcional = '') {
  if (urlOpcional && urlOpcional.trim()) return urlOpcional.trim();
  return (
    IMAGENES_PLATOS[Number(id)] ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80'
  );
}
