import connectDB from '@/app/lib/mongoose';
import ProductOffer from '@/app/models/ProductOffer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const offer = await ProductOffer.findById(id);
      if (!offer) {
        return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
      }
      return NextResponse.json(offer);
    }

    const offers = await ProductOffer.find();
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
      await connectDB();
      const { title, description, price, image } = await request.json();
  
      if (!title || !description || !price || !image) {
        return NextResponse.json(
          { error: 'Todos los campos son obligatorios (nombre, descripción, precio, imagen).' },
          { status: 400 }
        );
      }
  
      const nuevaOferta = new ProductOffer({ title, description, price, image });
      await nuevaOferta.save();
  
      return NextResponse.json(nuevaOferta, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error del servidor al crear la oferta. Intenta nuevamente.' },
        { status: 500 }
      );
    }
  }

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();
    await ProductOffer.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id'); // <- el id viene por query
  
      if (!id) {
        return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
      }
  
      const { title, price, description, image } = await request.json();
  
      const updatedOffer = await ProductOffer.findByIdAndUpdate(
        id,
        { title, price, description, image },
        { new: true }
      );
  
      return NextResponse.json(updatedOffer);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }
  }