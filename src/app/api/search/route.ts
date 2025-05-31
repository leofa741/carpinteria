import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/app/models/Product'; // Asegúrate de tener este modelo
import connectDB from '@/app/lib/mongoose';

connectDB();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Término de búsqueda requerido' }, { status: 400 });
    }

    // Busca productos por _id o name
    const products = await Product.find({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(query) ? query : null }, // Verifica si es un ObjectId válido
        { name: { $regex: query, $options: 'i' } }, // Búsqueda insensible a mayúsculas/minúsculas
      ],
    });

    if (products.length === 0) {
      return NextResponse.json({ message: 'No se encontraron productos', products: [] }, { status: 200 });
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}