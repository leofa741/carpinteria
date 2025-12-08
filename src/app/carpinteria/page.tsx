'use client';
import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

export default function CarpinteriaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PLANCHA_WIDTH = 2440;
  const PLANCHA_HEIGHT = 1220;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResultado(null);

    const formData = new FormData();
    formData.append('plano', file);

    try {
      const res = await fetch('/api/procesar-plano', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setResultado(data);
      else setError(data.message || 'Error al procesar el archivo');
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Dibuja las planchas
  useEffect(() => {
    if (!resultado || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const planchas = resultado.totalPlanchas?.planchas || [];
    const escala = canvas.width / PLANCHA_WIDTH;
    const espacioVertical = 60;
    const altoTotal = planchas.length * (PLANCHA_HEIGHT * escala + espacioVertical);
    canvas.height = altoTotal;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    const colores = ['#a5b4fc', '#f9a8d4', '#86efac', '#fcd34d', '#93c5fd'];

    let offsetY = 20;
    for (let i = 0; i < planchas.length; i++) {
      const piezas = planchas[i];

      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, offsetY, PLANCHA_WIDTH * escala, PLANCHA_HEIGHT * escala);

      ctx.fillStyle = '#111';
      ctx.fillText(`Plancha ${i + 1}`, (PLANCHA_WIDTH * escala) / 2, offsetY - 5);

      piezas.forEach((pieza: any, j: number) => {
        const { x, y, w, h } = pieza;
        const color = colores[j % colores.length];
        ctx.fillStyle = color + '88';
        ctx.fillRect(x * escala, offsetY + y * escala, w * escala, h * escala);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * escala, offsetY + y * escala, w * escala, h * escala);

        ctx.fillStyle = '#000';
        ctx.fillText(`${w}×${h}`, x * escala + (w * escala) / 2, offsetY + y * escala + (h * escala) / 2);
      });

      offsetY += PLANCHA_HEIGHT * escala + espacioVertical;
    }
  }, [resultado]);

  // 🧾 Exportar PDF
  const handleDescargarPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas || !resultado) return;

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;

    pdf.setFontSize(14);
    pdf.text('Plano de Despiece - Carpintería', 10, 15);
    pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);

    const { resumen } = resultado;
    pdf.setFontSize(12);
    pdf.text(`📏 Área total de piezas: ${resumen.areaPiezas.toLocaleString()} mm²`, 10, 15 + imgHeight + 10);
    pdf.text(`🪵 Área total planchas: ${resumen.areaPlanchas.toLocaleString()} mm²`, 10, 15 + imgHeight + 20);
    pdf.text(`✅ Aprovechamiento: ${resumen.aprovechamiento}%`, 10, 15 + imgHeight + 30);
    pdf.text(`⚠️ Desperdicio: ${resumen.desperdicio}%`, 10, 15 + imgHeight + 40);

    pdf.save('despiece.pdf');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📐 Simulador de Corte (DXF)</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-8">
        <input type="file" accept=".dxf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Procesando...' : 'Procesar Plano'}
        </button>
      </form>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {resultado && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Resultado del Despiece</h2>
          <p>{resultado.mensaje}</p>

          <div className="mt-4 text-left inline-block">
            <strong>Piezas detectadas:</strong>
            <ul className="list-disc list-inside">
              {resultado.piezas.map((p: any, i: number) => (
                <li key={i}>
                  {p.w} × {p.h} mm
                </li>
              ))}
            </ul>
          </div>

          <canvas ref={canvasRef} width={900} height={600} className="border mt-6 rounded shadow bg-white" />

          <div className="mt-4">
            <button onClick={handleDescargarPDF} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              📄 Descargar PDF con Resumen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
