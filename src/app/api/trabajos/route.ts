import connectDB from '@/app/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Trabajo from '@/app/models/Trabajo';

// GET: obtener todos los trabajos
export async function GET() {
  await connectDB();
  const trabajos = await Trabajo.find().sort({ createdAt: -1 });
  return NextResponse.json(trabajos);
}


// POST: crear un trabajo
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { titulo, descripcion, categoria, imagenes } = body;

    if (!titulo || !descripcion || !categoria || !imagenes || !Array.isArray(imagenes)) {
      return NextResponse.json({ error: 'Faltan datos obligatorios o imágenes inválidas' }, { status: 400 });
    }

    const nuevoTrabajo = new Trabajo({ titulo, descripcion, categoria, imagenes });
    await nuevoTrabajo.save();
    return NextResponse.json(nuevoTrabajo, { status: 201 });
  } catch (err) {
    console.error('Error al crear trabajo:', err);
    return NextResponse.json({ error: 'Error al crear trabajo' }, { status: 500 });
  }
}

// PUT: actualizar un trabajo por ID
// PUT: actualizar un trabajo por ID
export async function PUT(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });

  try {
    const body = await req.json();
    const { titulo, descripcion, categoria, imagenes } = body;

    const data = { titulo, descripcion, categoria, imagenes };

    const trabajoActualizado = await Trabajo.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json(trabajoActualizado);
  } catch (err) {
    return NextResponse.json({ error: 'Error al actualizar trabajo' }, { status: 500 });
  }
}


// DELETE: eliminar un trabajo por ID
export async function DELETE(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });

  try {
    await Trabajo.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Trabajo eliminado' });
  } catch (err) {
    return NextResponse.json({ error: 'Error al eliminar trabajo' }, { status: 500 });
  }
}
