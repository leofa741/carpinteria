import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongoose';
import Trabajo from '@/app/models/Trabajo';

connectDB();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Término de búsqueda requerido' }, { status: 400 });
    }

    // Verifica si el término de búsqueda es un ObjectId válido
    if (mongoose.Types.ObjectId.isValid(query)) { 
      const trabajo = await Trabajo.findById(query).populate('categoria');

      if (!trabajo) {
        return NextResponse.json({ message: 'Trabajo no encontrado', status: 404 }, { status: 404 });
      }

      return NextResponse.json({ products: [trabajo] }, { status: 200 });
    }

    
    const regex = new RegExp(query, 'i'); // 'i' para búsqueda insensible a mayúsculas
    const trabajos = await Trabajo.find({
      $or: [
        { titulo: regex },
        { descripcion: regex },
        { categoria: regex }
      ]
    }).populate('categoria');
    
    if (trabajos.length === 0) {
      return NextResponse.json({ message: 'No se encontraron trabajos' }, { status: 404 });
    }
    return NextResponse.json({ products: trabajos }, { status: 200 });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}