'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NotAuthorized from '@/app/components/notauth/Notauthorized';
import LoadingSpinner from '@/app/components/spiner/Spiner';
import Swal from 'sweetalert2';

interface Paso {
  _id?: string;
  orden: number;
  titulo: string;
  descripcion: string;
  mediaUrl: string;
  tipoMedia: 'video' | 'imagen';
}

interface ProcesoData {
  _id: string;
  tituloProyecto: string;
  descripcionGeneral: string;
  clienteOtipo: string;
  pasos: Paso[];
  destacado: boolean;
}

interface EditarProcesoFormProps {
  initialData: ProcesoData;
}

export default function EditarProcesoForm({ initialData }: EditarProcesoFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeStepUpload, setActiveStepUpload] = useState<number | null>(null);

  // Inicializamos el estado con los datos existentes
  const [form, setForm] = useState<ProcesoData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasoChange = (index: number, field: keyof Paso, value: string | number) => {
    setForm((prev) => {
      const nuevosPasos = [...prev.pasos];
      nuevosPasos[index] = { ...nuevosPasos[index], [field]: value };
      return { ...prev, pasos: nuevosPasos };
    });
  };

  const addPaso = () => {
    const nuevoOrden = form.pasos.length > 0 ? Math.max(...form.pasos.map(p => p.orden)) + 1 : 1;
    setForm((prev) => ({
      ...prev,
      pasos: [...prev.pasos, { orden: nuevoOrden, titulo: '', descripcion: '', mediaUrl: '', tipoMedia: 'video' }],
    }));
  };

  const removePaso = (index: number) => {
    if (form.pasos.length === 1) return;
    const nuevosPasos = form.pasos.filter((_, i) => i !== index);
    nuevosPasos.forEach((p, i) => (p.orden = i + 1));
    setForm((prev) => ({ ...prev, pasos: nuevosPasos }));
  };

  const handleFileUpload = async (file: File, pasoIndex: number, tipo: 'video' | 'imagen') => {
    setUploading(true);
    setActiveStepUpload(pasoIndex);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) throw new Error('Faltan variables de entorno de Cloudinary');

      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'carpinteria-rubilar/procesos');

      const resourceType = tipo === 'video' ? 'video' : 'image';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(url, { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error?.message || `Error HTTP: ${res.status}`);

      if (data.secure_url) {
        setForm((prev) => {
          const nuevosPasos = [...prev.pasos];
          nuevosPasos[pasoIndex] = { 
            ...nuevosPasos[pasoIndex], 
            mediaUrl: data.secure_url,
            tipoMedia: tipo 
          };
          return { ...prev, pasos: nuevosPasos };
        });
        setMessage({ type: 'success', text: `✅ Archivo del paso ${pasoIndex + 1} actualizado correctamente.` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error al subir: ${error.message}` });
    } finally {
      setUploading(false);
      setActiveStepUpload(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pasosSinArchivo = form.pasos.filter(p => !p.mediaUrl);
    if (pasosSinArchivo.length > 0) {
      setMessage({ type: 'error', text: `⚠️ Hay ${pasosSinArchivo.length} paso(s) sin archivo. Subí un video o imagen para cada paso.` });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/procesos?id=${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('¡Actualizado!', 'El proceso se guardó correctamente.', 'success');
      setTimeout(() => {
        router.push('/procesos');
        router.refresh();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Hubo un error al guardar. Revisá la consola.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return <NotAuthorized />;
  if (!form) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/procesos" className="text-amber-600 hover:text-amber-700 text-sm font-medium mb-6 inline-flex items-center gap-1">
          ← Volver a procesos
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">Editar Story Time</h1>
          <p className="text-stone-500 dark:text-stone-400 mb-8">Modificá los detalles o agregá nuevos pasos al proceso.</p>

          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos Generales */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Título del Proyecto</label>
                  <input type="text" name="tituloProyecto" value={form.tituloProyecto} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Cliente / Tipo</label>
                  <input type="text" name="clienteOtipo" value={form.clienteOtipo} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Descripción General</label>
                <textarea name="descripcionGeneral" value={form.descripcionGeneral} onChange={handleChange} required rows={3} className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>

            {/* Pasos Dinámicos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Pasos del Proceso</h3>
                <button type="button" onClick={addPaso} className="text-sm bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                  + Agregar Paso
                </button>
              </div>

              {form.pasos.map((paso, index) => (
                <div key={index} className={`p-5 rounded-xl space-y-4 relative group transition-all duration-300 ${!paso.mediaUrl ? 'bg-red-50 dark:bg-red-900/10 border-2 border-red-300 dark:border-red-800' : 'bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                      Paso {paso.orden} {!paso.mediaUrl && '⚠️ (Falta archivo)'}
                    </span>
                    {form.pasos.length > 1 && (
                      <button type="button" onClick={() => removePaso(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Título del paso" value={paso.titulo} onChange={(e) => handlePasoChange(index, 'titulo', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm" />
                    <select value={paso.tipoMedia} onChange={(e) => handlePasoChange(index, 'tipoMedia', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm">
                      <option value="video">Video</option>
                      <option value="imagen">Imagen</option>
                    </select>
                  </div>
                  
                  <textarea placeholder="Descripción breve..." value={paso.descripcion} onChange={(e) => handlePasoChange(index, 'descripcion', e.target.value)} required rows={2} className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm" />

                  <div className="flex flex-col gap-2">
                    <input type="file" accept={paso.tipoMedia === 'video' ? 'video/mp4,video/webm' : 'image/*'} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], index, paso.tipoMedia)} disabled={uploading} className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 dark:file:bg-amber-900/30 dark:file:text-amber-400" />
                    {activeStepUpload === index && <span className="text-xs text-amber-600 animate-pulse font-medium">Subiendo nuevo archivo...</span>}
                  </div>
                  
                  {paso.mediaUrl && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Archivo actual: <span className="text-stone-500 truncate max-w-[200px]">{paso.mediaUrl}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Opciones y Submit */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} className="w-5 h-5 text-amber-600 rounded border-stone-300 focus:ring-amber-500" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Marcar como Destacado</span>
              </label>

              <button type="submit" disabled={loading || uploading} className="w-full md:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2">
                {loading ? 'Guardando cambios...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}