


import connectDB from '@/app/lib/mongoose';
import MaderaProceso from '@/app/models/MaderaProceso';

import EditarMaderaForm from './EditarMaderaForm';
import { notFound } from 'next/navigation';

export default async function EditarMaderaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  
  await connectDB();
  const madera = await MaderaProceso.findById(id).lean();

  if (!madera) {
    notFound();
  }

  const maderaData = JSON.parse(JSON.stringify(madera));

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <EditarMaderaForm initialData={maderaData} id={id} />
      </div>
    </main>
  );
}