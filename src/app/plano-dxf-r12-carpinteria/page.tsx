'use client';
import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

const PLANCHA_WIDTH = 2440;
const PLANCHA_HEIGHT = 1220;
const KERF = 3;

export default function CarpinteriaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const subir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResultado(null);

    const formData = new FormData();
    formData.append('plano', file);
    try {
      const res = await fetch('/api/procesar-plano-optimizado', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setResultado(data);
      } else {
        setError(data.message || 'Error procesando DXF');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Dibujar planchas y piezas
  useEffect(() => {
    if (!resultado || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const planchas = resultado.planchas || [];
    const escala = canvas.width / PLANCHA_WIDTH;
    const gap = 50;
    canvas.height = planchas.length * (PLANCHA_HEIGHT * escala + gap);

    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colores = ['#a5b4fc', '#f9a8d4', '#86efac', '#fcd34d', '#93c5fd', '#fca5a5', '#c7f9ff'];

    for (let pi = 0; pi < planchas.length; pi++) {
      const plan = planchas[pi];
      const baseY = pi * (PLANCHA_HEIGHT * escala + gap);

      // Borde de la plancha
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, baseY, PLANCHA_WIDTH * escala, PLANCHA_HEIGHT * escala);

      // Etiqueta
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`Plancha ${pi + 1}`, 60, baseY + 18);

      plan.forEach((r: any, i: number) => {
        const x = r.x * escala;
        const y = baseY + r.y * escala;
        const w = r.w * escala;
        const h = r.h * escala;
        const color = colores[i % colores.length];

        // Pieza
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Texto
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${r.w}×${r.h}`, x + 6, y + 14);

        // Líneas de kerf (simulación)
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = Math.max(1, KERF * escala * 0.8);
        ctx.beginPath();
        ctx.moveTo(x + w + (KERF / 2) * escala, y);
        ctx.lineTo(x + w + (KERF / 2) * escala, y + h);
        ctx.moveTo(x, y + h + (KERF / 2) * escala);
        ctx.lineTo(x + w, y + h + (KERF / 2) * escala);
        ctx.stroke();
      });
    }
  }, [resultado]);

  const descargarPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas || !resultado) return;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const img = canvas.toDataURL('image/png');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgW = pw - margin * 2;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.text('Despiece optimizado', margin, 12);
    pdf.addImage(img, 'PNG', margin, 15, imgW, Math.min(imgH, ph - 40));
    // Métricas
    const r = resultado.resumen || {};
    pdf.setFontSize(11);
    pdf.text(`Piezas: ${resultado.piezas.length}`, margin, ph - 20);
    pdf.text(`Planchas: ${resultado.totalPlanchas}`, margin + 50, ph - 20);
    pdf.text(`Aprovechamiento: ${r.aprovechamiento ?? 'N/A'}%`, margin + 110, ph - 20);
    pdf.save('despiece_optimizado.pdf');
  };

  const descargarJSON = () => {
    if (!resultado) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(resultado, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'despiece_optimizado.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Optimizador 2D para Carpintería (DXF)</h1>

      <form onSubmit={subir} className="flex gap-4 items-center mb-6">
        <input type="file" accept=".dxf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          type="submit"
          disabled={loading || !file}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Optimizar DXF'}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {resultado && (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <strong>Planchas usadas:</strong> {resultado.totalPlanchas}
            </div>
            <div>
              <strong>Piezas:</strong> {resultado.piezas.length}
            </div>
            <div>
              <strong>Aprovechamiento:</strong> {resultado.resumen?.aprovechamiento ?? 'N/A'}%
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={descargarPDF} className="px-3 py-1 bg-green-600 text-white rounded">PDF</button>
              <button onClick={descargarJSON} className="px-3 py-1 bg-gray-600 text-white rounded">JSON</button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={1200}
            style={{ width: '100%', height: 'auto', border: '1px solid #444' }}
          />
        </>
      )}
    </div>
  );
}