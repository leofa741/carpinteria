'use server';

import connectDB from '@/app/lib/mongoose';
import MaderaProceso from '@/app/models/MaderaProceso';
import { revalidatePath } from 'next/cache';

export async function deleteMadera(id: string) {
  try {
    await connectDB();
    await MaderaProceso.findByIdAndDelete(id);
    
    // Esto le dice a Next.js que vuelva a cargar los datos de esta página
    revalidatePath('/maderas');
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar madera:', error);
    return { success: false, error: 'No se pudo eliminar el registro' };
  }
}