import connectDB from '@/app/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import ProcesoTrabajo from '@/app/models/ProcesoTrabajo';


// GET: obtener todos los procesos
export async function GET() {
  try {
    await connectDB();
    const procesos = await ProcesoTrabajo.find().sort({ destacado: -1, createdAt: -1 }).lean();
    return NextResponse.json(procesos);
  } catch (err) {
    console.error('Error al obtener procesos:', err);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}


// POST: crear un nuevo proceso
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { tituloProyecto, descripcionGeneral, clienteOtipo, pasos, destacado } = body;

    if (!tituloProyecto || !descripcionGeneral || !Array.isArray(pasos) || pasos.length === 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios o pasos' }, { status: 400 });
    }

    const nuevoProceso = new ProcesoTrabajo({
      tituloProyecto,
      descripcionGeneral,
      clienteOtipo,
      pasos,
      destacado,
    });
    
    await nuevoProceso.save();
    return NextResponse.json(nuevoProceso, { status: 201 });
  } catch (err) {
    console.error('Error al crear proceso:', err);
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 });
  }
}


// PUT: actualizar un proceso por ID
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta el ID en la URL' }, { status: 400 });

    const body = await req.json();
    const procesoActualizado = await ProcesoTrabajo.findByIdAndUpdate(id, body, { new: true });

    if (!procesoActualizado) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(procesoActualizado);
  } catch (err) {
    console.error('Error al actualizar proceso:', err);
    return NextResponse.json({ error: 'Error al actualizar registro' }, { status: 500 });
  }
}


// DELETE: eliminar un proceso por ID
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });

    await ProcesoTrabajo.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Registro eliminado' });
  } catch (err) {
    console.error('Error al eliminar proceso:', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}