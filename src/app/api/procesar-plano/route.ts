import { NextRequest, NextResponse } from 'next/server';
import DxfParser from 'dxf-parser';

export const maxDuration = 30;

function calcularPlanchasNecesarias(
  piezas: { w: number; h: number }[],
  planchaWidth: number,
  planchaHeight: number
) {
  if (piezas.length === 0) return { planchas: [], total: 0 };

  const MARGEN_CORTE = 3;
  const piezasOrdenadas = [...piezas].sort((a, b) => b.h - a.h);
  const planchas: any[] = [];

  let actual: any[] = [];
  let offsetX = 0;
  let offsetY = 0;
  let filaAltura = 0;

  for (const { w, h } of piezasOrdenadas) {
    if (w > planchaWidth || h > planchaHeight) continue;

    if (offsetX + w + MARGEN_CORTE > planchaWidth) {
      offsetX = 0;
      offsetY += filaAltura + MARGEN_CORTE;
      filaAltura = 0;
    }

    if (offsetY + h + MARGEN_CORTE > planchaHeight) {
      planchas.push(actual);
      actual = [];
      offsetX = 0;
      offsetY = 0;
      filaAltura = 0;
    }

    actual.push({ w, h, x: offsetX, y: offsetY });
    offsetX += w + MARGEN_CORTE;
    filaAltura = Math.max(filaAltura, h);
  }

  if (actual.length > 0) planchas.push(actual);

  return { planchas, total: planchas.length };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('plano') as File;
    if (!file) return NextResponse.json({ message: 'No se subió ningún archivo DXF.' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(arrayBuffer);

    const parser = new DxfParser();
    let parsed;
    try {
      parsed = parser.parse(text);
    } catch (e) {
      console.error('Error al parsear DXF:', e);
      return NextResponse.json({ message: 'Archivo DXF inválido o corrupto.' }, { status: 400 });
    }

    const items: { w: number; h: number }[] = [];

    if (parsed?.entities) {
      for (const entity of parsed.entities) {
        if (
          entity.type === 'LWPOLYLINE' &&
          Array.isArray((entity as any).vertices) &&
          (entity as any).vertices.length === 4
        ) {
          const vertices = (entity as any).vertices;
          const xs = vertices.map((v: any) => v.x);
          const ys = vertices.map((v: any) => v.y);
          const width = Math.round(Math.max(...xs) - Math.min(...xs));
          const height = Math.round(Math.max(...ys) - Math.min(...ys));
          if (width >= 50 && height >= 50) items.push({ w: width, h: height });
        }
      }
    }

    if (items.length === 0)
      return NextResponse.json({ message: 'No se detectaron rectángulos válidos en el DXF.' }, { status: 400 });

    const totalPlanchas = calcularPlanchasNecesarias(items, 2440, 1220);

    const areaPiezas = items.reduce((acc, p) => acc + p.w * p.h, 0);
    const areaPlanchas = totalPlanchas.total * 2440 * 1220;
    const aprovechamiento = ((areaPiezas / areaPlanchas) * 100).toFixed(2);

    return NextResponse.json({
      piezas: items,
      totalPlanchas,
      mensaje: `✅ Se necesitan ${totalPlanchas.total} plancha(s) para cortar ${items.length} piezas.`,
      resumen: {
        areaPiezas,
        areaPlanchas,
        aprovechamiento,
        desperdicio: (100 - Number(aprovechamiento)).toFixed(2),
      },
    });
  } catch (e) {
    console.error('Error general:', e);
    return NextResponse.json({ message: 'Error interno en el servidor.' }, { status: 500 });
  }
}
