'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/app/lib/mongoose';
import ProcesoTrabajo from '@/app/models/ProcesoTrabajo';

export async function deleteProceso(id: string) {
  try {
    // 1. Nos conectamos directamente a la base de datos
    await connectDB();
    
    // 2. Eliminamos el registro por su ID
    await ProcesoTrabajo.findByIdAndDelete(id);
    
    // 3. Le decimos a Next.js que actualice la caché de la página de procesos
    revalidatePath('/procesos');
    
    return { success: true };
  } catch (error) {
    console.error('Error en Server Action deleteProceso:', error);
    return { 
      success: false, 
      error: 'Ocurrió un error al intentar eliminar el proceso. Revisá la consola.' 
    };
  }
}