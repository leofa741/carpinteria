import connectDB from '@/app/lib/mongoose';
import MaderaProceso from '@/app/models/MaderaProceso';
import MaderasGrid from './MaderasGrid';
import { deleteMadera } from '@/app/actions/maderas';
import { useSession } from 'next-auth/react';
import { AuthContext } from '@/app/context/AuthContext';
import { useContext } from 'react';


export const metadata = {
  title: 'Maderas y Procesos | Carpintería Rubilar',
  description: 'Descubrí nuestras especies nativas, procesos artesanales y fichas técnicas para arquitectos.',
};

async function getMaderas() {
  await connectDB();
  const maderas = await MaderaProceso.find().sort({ destacado: -1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(maderas));
}

export default async function MaderasPage() {
  const maderas = await getMaderas();
  
  
  

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-16 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 tracking-tight">
            El Alma de la Madera
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Explorá nuestras especies nativas y el proceso artesanal detrás de cada pieza. 
            Diseñado para arquitectos y profesionales que valoran el detalle.
          </p>
        </div>

        {/* Aquí pasamos las props nuevas */}
        <MaderasGrid 
          maderas={maderas}         
          onDelete={deleteMadera} 
        />
      </div>
    </main>
  );
}