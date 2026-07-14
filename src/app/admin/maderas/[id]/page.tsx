import connectDB from '@/app/lib/mongoose';
import MaderaProceso from '@/app/models/MaderaProceso';
import EditarMaderaForm from './EditarMaderaForm';
import { notFound } from 'next/navigation';

// Next.js requiere que los params sean esperados así en App Router
export default async function EditarMaderaPage({ params }: { params: Promise<{ id: string }> }) {
  // Desempaquetamos los params (necesario en Next.js 15+)
  const { id } = await params;
  
  await connectDB();
  
  // Buscamos el registro por ID
  const madera = await MaderaProceso.findById(id).lean();

  // Si no existe, mostramos 404 real
  if (!madera) {
    notFound();
  }

  // Convertimos a objeto plano para pasarlo al cliente
  const maderaData = JSON.parse(JSON.stringify(madera));

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <EditarMaderaForm initialData={maderaData} id={id} />
      </div>
    </main>
  );
}