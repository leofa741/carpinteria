import connectDB from '@/app/lib/mongoose';
import MaderaProceso from '@/app/models/MaderaProceso';
import EditarMaderaForm from './EditarMaderaForm'; // ⚠️ Asegúrate de que este import apunte al formulario
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function EditarMaderaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Protección: Si no es admin, lo mandamos de vuelta a la galería
  const session = await getServerSession();
  if (session?.user?.role !== 'admin') {
    redirect('/maderas'); 
  }
  
  // 2. Buscar datos
  await connectDB();
  const madera = await MaderaProceso.findById(id).lean();

  if (!madera) {
    notFound();
  }

  const maderaData = JSON.parse(JSON.stringify(madera));

  // 3. Renderizar el formulario con los datos
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <EditarMaderaForm initialData={maderaData} id={id} />
      </div>
    </main>
  );
}