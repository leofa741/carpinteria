import connectDB from '@/app/lib/mongoose';
import ProcesoTrabajo from '@/app/models/ProcesoTrabajo';
import StoryTimeViewer from '@/app/components/storytime/StoryTimeViewer'; // ✅ Tu ruta actualizada, está perfecto
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProceso(id: string) {
  await connectDB();
  const proceso = await ProcesoTrabajo.findById(id).lean();
  if (!proceso) return null;
  return JSON.parse(JSON.stringify(proceso));
}

// ✅ CORRECCIÓN CLAVE: params ahora es Promise<{ id: string }> en Next.js 15
export default async function ProcesoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Hacemos await de params para extraer el ID correctamente
  const { id } = await params;
  
  // 2. Buscamos el proceso con ese ID
  const proceso = await getProceso(id);

  // 3. Si no existe, recién ahí mostramos el 404
  if (!proceso) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-950 px-4 py-12 md:px-8">
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/procesos" className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors font-medium">
          ← Volver a la galería de procesos
        </Link>
      </div>
      
      {/* Renderizamos el componente con los datos correctos */}
      <StoryTimeViewer proceso={proceso} />
      
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">¿Te gustó este proceso?</h3>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          Podemos replicar esta calidad y atención al detalle en tu próximo proyecto.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200"
        >
          Solicitar Presupuesto
        </Link>
      </div>
    </main>
  );
}