'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface Especificaciones {
  densidad: string;
  usoRecomendado: string;
  acabado: string;
}

interface MaderaData {
  _id: string;
  nombreMadera: string;
  tituloProceso: string;
  descripcion: string;
  videoUrl: string;
  thumbnailUrl: string;
  especificaciones: Especificaciones;
  destacado: boolean;
}

export default function EditarMaderaForm({ initialData, id }: { initialData: MaderaData; id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pre-cargamos el formulario con los datos existentes
  const [form, setForm] = useState({
    nombreMadera: initialData.nombreMadera,
    tituloProceso: initialData.tituloProceso,
    descripcion: initialData.descripcion,
    videoUrl: initialData.videoUrl,
    thumbnailUrl: initialData.thumbnailUrl,
    densidad: initialData.especificaciones?.densidad || '',
    usoRecomendado: initialData.especificaciones?.usoRecomendado || '',
    acabado: initialData.especificaciones?.acabado || '',
    destacado: initialData.destacado,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ ESTA ES LA EXACTA MISMA FUNCIÓN QUE YA TE FUNCIONA EN "NUEVO"
  const handleFileUpload = async (file: File, type: 'video' | 'thumbnail') => {
    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Faltan las variables de entorno de Cloudinary en el archivo .env.local');
      }

      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'carpinteria-rubilar/maderas'); 

      const resourceType = type === 'video' ? 'video' : 'image';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error('Respuesta completa de Cloudinary:', data);
        throw new Error(data.error?.message || `Error HTTP: ${res.status}`);
      }

      if (data.secure_url) {
        setForm((prev) => ({
          ...prev,
          [type === 'video' ? 'videoUrl' : 'thumbnailUrl']: data.secure_url,
        }));
        setMessage({ 
          type: 'success', 
          text: `✅ ${type === 'video' ? 'Video' : 'Imagen'} actualizado correctamente.` 
        });
      } else {
        console.error('Datos recibidos sin secure_url:', data);
        throw new Error('La respuesta de Cloudinary no contiene secure_url');
      }

    } catch (error: any) {
      console.error('Error detallado en handleFileUpload:', error);
      setMessage({ 
        type: 'error', 
        text: `Error al subir: ${error.message}. Revisa la consola (F12) para más detalles.` 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        nombreMadera: form.nombreMadera,
        tituloProceso: form.tituloProceso,
        descripcion: form.descripcion,
        videoUrl: form.videoUrl,
        thumbnailUrl: form.thumbnailUrl,
        especificaciones: {
          densidad: form.densidad,
          usoRecomendado: form.usoRecomendado,
          acabado: form.acabado,
        },
        destacado: form.destacado,
      };

      // Llamamos a la ruta PUT que ya creamos antes
      const res = await fetch(`/api/maderas?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('¡Actualizado!', 'Los cambios se guardaron correctamente.', 'success');
      
      setTimeout(() => {
        router.push('/maderas');
        router.refresh();
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Hubo un error al guardar. Revisá la consola.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link href="/maderas" className="text-amber-600 hover:text-amber-700 text-sm font-medium mb-6 inline-flex items-center gap-1">
        ← Volver a la galería
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-8"
      >
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Editar Registro de Madera
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8">
          Modificá los datos del proceso artesanal y las especificaciones técnicas.
        </p>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Datos Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre de la Madera</label>
              <input type="text" name="nombreMadera" value={form.nombreMadera} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Título del Proceso</label>
              <input type="text" name="tituloProceso" value={form.tituloProceso} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Descripción del Proceso</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>

          {/* Sección 2: Archivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-stone-100 dark:bg-stone-800/50 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Video del Proceso</label>
              <p className="text-xs text-stone-500 mb-2 break-all truncate">URL Actual: {form.videoUrl}</p>
              <input 
                type="file" 
                accept="video/mp4,video/webm" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')} 
                disabled={uploading} 
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 dark:file:bg-amber-900/30 dark:file:text-amber-400 disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Imagen de Portada</label>
              <p className="text-xs text-stone-500 mb-2 break-all truncate">URL Actual: {form.thumbnailUrl}</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'thumbnail')} 
                disabled={uploading} 
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 dark:file:bg-amber-900/30 dark:file:text-amber-400 disabled:opacity-50" 
              />
            </div>
          </div>

          {/* Sección 3: Ficha Técnica */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">Ficha Técnica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Densidad / Peso</label>
                <input type="text" name="densidad" value={form.densidad} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Uso Recomendado</label>
                <input type="text" name="usoRecomendado" value={form.usoRecomendado} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Acabado Sugerido</label>
                <input type="text" name="acabado" value={form.acabado} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm" />
              </div>
            </div>
          </div>

          {/* Sección 4: Opciones */}
          <div className="flex items-center gap-3 pt-4">
            <input type="checkbox" id="destacado" name="destacado" checked={form.destacado} onChange={handleChange} className="w-5 h-5 text-amber-600 rounded border-stone-300 focus:ring-amber-500" />
            <label htmlFor="destacado" className="text-sm font-medium text-stone-700 dark:text-stone-300">Marcar como "Destacado"</label>
          </div>

          {/* Botón de Envío */}
          <div className="pt-6">
            <button type="submit" disabled={loading || uploading} className="w-full md:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2">
              {loading || uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}