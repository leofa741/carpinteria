import EditarProcesoForm from '@/app/components/edittprocesos/EditarProcesoForm';
import connectDB from '@/app/lib/mongoose';
import ProcesoTrabajo from '@/app/models/ProcesoTrabajo';

import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProceso(id: string) {
  await connectDB();
  // Buscamos directamente por ID
  const proceso = await ProcesoTrabajo.findById(id).lean();
  if (!proceso) return null;
  return JSON.parse(JSON.stringify(proceso));
}

export default async function EditarProcesoPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Next.js 15: params es una promesa, hay que hacerle await
  const { id } = await params;
  
  const proceso = await getProceso(id);

  if (!proceso) {
    notFound();
  }

  return <EditarProcesoForm initialData={proceso} />;
}