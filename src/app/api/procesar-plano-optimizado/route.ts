import { NextRequest, NextResponse } from 'next/server';
import DxfParser from 'dxf-parser';
import { MaxRectsPacker } from 'maxrects-packer';

export const maxDuration = 30;

const PLANCHA_WIDTH = 2440;
const PLANCHA_HEIGHT = 1220;
const KERF = 3; // mm padding para simular el corte

// Normaliza piezas (w,h) y filtra inválidas
function extraerPiezasDesdeParsed(parsed: any) {
  const piezas: { id: string; w: number; h: number }[] = [];
  let id = 1;
  for (const entity of parsed?.entities || []) {
    // Soportamos LWPOLYLINE con >=4 vértices (tomamos bounding box)
    if (entity.type === 'LWPOLYLINE' && Array.isArray(entity.vertices) && entity.vertices.length >= 4) {
      const verts = entity.vertices;
      const xs = verts.map((v: any) => v.x);
      const ys = verts.map((v: any) => v.y);
      const w = Math.round(Math.max(...xs) - Math.min(...xs));
      const h = Math.round(Math.max(...ys) - Math.min(...ys));
      if (w >= 10 && h >= 10) {
        piezas.push({ id: `P${id++}`, w, h });
      }
    }
    // También soportamos older POLYLINE/VERTEX si aparecen en parsed.entities
    if (entity.type === 'POLYLINE' && Array.isArray(entity.vertices) && entity.vertices.length >= 4) {
      const verts = entity.vertices;
      const xs = verts.map((v: any) => v.x);
      const ys = verts.map((v: any) => v.y);
      const w = Math.round(Math.max(...xs) - Math.min(...xs));
      const h = Math.round(Math.max(...ys) - Math.min(...ys));
      if (w >= 10 && h >= 10) {
        piezas.push({ id: `P${id++}`, w, h });
      }
    }
  }
  return piezas;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('plano') as File;
    if (!file) return NextResponse.json({ message: 'Por favor sube un archivo DXF.' }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);

    const parser = new DxfParser();
    let parsed;
    try {
      parsed = parser.parse(text);
    } catch (e) {
      console.error('Error parseando DXF:', e);
      return NextResponse.json({ message: 'DXF inválido o corrupto.' }, { status: 400 });
    }

    const piezas = extraerPiezasDesdeParsed(parsed);
    if (piezas.length === 0) {
      return NextResponse.json({ message: 'No se encontraron piezas rectangulares en el DXF.' }, { status: 400 });
    }

    // Packing MaxRects: cada pieza se añade con padding = KERF (para separación)
    const packer = new MaxRectsPacker(PLANCHA_WIDTH, PLANCHA_HEIGHT, KERF, { smart: true, pot: false, allowRotation: true });

    for (const p of piezas) {
      // Intentamos añadir tal cual (rotación automática por el algoritmo si conviene)
      packer.add(p.w + KERF, p.h + KERF, { id: p.id, origW: p.w, origH: p.h });
    }

    // formatear salida: bins -> planchas con rects (restamos KERF para mostrar medidas reales)
    const planchas = packer.bins.map((bin) =>
      bin.rects.map((r) => ({
        id: r.data.id,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(Math.max(0, r.width - KERF)),
        h: Math.round(Math.max(0, r.height - KERF)),
        rotated: (r.width - KERF === r.data.origH && r.height - KERF === r.data.origW) // heurística simple
      }))
    );

    // Métricas de aprovechamiento
    const areaPiezas = piezas.reduce((s, p) => s + p.w * p.h, 0);
    const areaPlanchas = packer.bins.length * PLANCHA_WIDTH * PLANCHA_HEIGHT;
    const aprovechamiento = +(areaPiezas / areaPlanchas * 100).toFixed(2);

    return NextResponse.json({
      piezas,
      planchas,
      totalPlanchas: packer.bins.length,
      mensaje: `✅ Se necesitan ${packer.bins.length} plancha(s) de ${PLANCHA_WIDTH} x ${PLANCHA_HEIGHT} mm.`,
      resumen: {
        areaPiezas,
        areaPlanchas,
        aprovechamiento,
        desperdicio: +(100 - aprovechamiento).toFixed(2),
      },
    });
  } catch (err) {
    console.error('Error en API:', err);
    return NextResponse.json({ message: 'Error interno al procesar el DXF.' }, { status: 500 });
  }
}
