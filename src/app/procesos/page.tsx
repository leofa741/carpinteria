import connectDB from '@/app/lib/mongoose';
import ProcesoTrabajo from '@/app/models/ProcesoTrabajo';

import { deleteProceso } from '@/app/actions/procesos';
import ProcesosGrid from '../components/procesos/ProcesosGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nuestros Procesos - Carpintería Artesanal',
  description: 'Descubrí el paso a paso detrás de cada pieza única. Transparencia, calidad y detalle artesanal.',
};

async function getProcesos() {
  await connectDB();
  const procesos = await ProcesoTrabajo.find().sort({ destacado: -1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(procesos));
}

export default async function ProcesosPage() {
  const procesos = await getProcesos();

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-16 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 tracking-tight">
            Del Taller a tu Espacio
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Hacé clic en cada proyecto para vivir la experiencia completa. 
            Mirá cómo transformamos la materia prima en piezas de diseño.
          </p>
        </div>

        {/* ✅ Aquí delegamos la renderización y la lógica de admin al componente cliente */}
        <ProcesosGrid 
          procesos={procesos}
          onDelete={deleteProceso}
        />
      </div>
    </main>
  );
}