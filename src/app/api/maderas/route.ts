import connectDB from '@/app/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import MaderaProceso from '@/app/models/MaderaProceso';

// ✅ GET: obtener todos los procesos de madera
export async function GET() {
  try {
    await connectDB();
    const maderas = await MaderaProceso.find().sort({ destacado: -1, createdAt: -1 });
    return NextResponse.json(maderas);
  } catch (err) {
    console.error('Error al obtener maderas:', err);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}

// ✅ POST: crear un nuevo registro
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { nombreMadera, tituloProceso, descripcion, videoUrl, thumbnailUrl, especificaciones, destacado } = body;

    // Validación estricta
    const camposFaltantes = [];
    if (!nombreMadera) camposFaltantes.push('nombreMadera');
    if (!tituloProceso) camposFaltantes.push('tituloProceso');
    if (!videoUrl) camposFaltantes.push('videoUrl');
    if (!thumbnailUrl) camposFaltantes.push('thumbnailUrl');

    if (camposFaltantes.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}` }, 
        { status: 400 }
      );
    }

    const nuevoRegistro = new MaderaProceso({
      nombreMadera, tituloProceso, descripcion, videoUrl, thumbnailUrl, especificaciones, destacado
    });
    
    await nuevoRegistro.save();
    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (err) {
    console.error('Error al crear registro de madera:', err);
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 });
  }
}

// ✅ PUT: actualizar un registro por ID (¡ESTE ERA EL QUE FALTABA/ESTABA MAL!)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta el ID en la URL' }, { status: 400 });

    const body = await req.json();
    const { nombreMadera, tituloProceso, descripcion, videoUrl, thumbnailUrl, especificaciones, destacado } = body;

    const data = { 
      nombreMadera, 
      tituloProceso, 
      descripcion, 
      videoUrl, 
      thumbnailUrl, 
      especificaciones, 
      destacado 
    };

    const maderaActualizada = await MaderaProceso.findByIdAndUpdate(id, data, { new: true });

    if (!maderaActualizada) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(maderaActualizada);
  } catch (err) {
    console.error('Error al actualizar madera:', err);
    return NextResponse.json({ error: 'Error al actualizar registro' }, { status: 500 });
  }
}

// ✅ DELETE: eliminar por ID
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });

    await MaderaProceso.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Registro eliminado' });
  } catch (err) {
    console.error('Error al eliminar madera:', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}