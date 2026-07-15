'use client';

import { motion } from 'framer-motion';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Especificaciones {
  densidad?: string;
  usoRecomendado?: string;
  acabado?: string;
}

export interface Madera {
  _id: string;
  nombreMadera: string;
  tituloProceso: string;
  descripcion: string;
  videoUrl: string;
  thumbnailUrl: string;
  especificaciones?: Especificaciones; // ✅ Ahora es opcional
  destacado?: boolean; // ✅ Ahora es opcional
}

interface MaderasGridProps {
  maderas: Madera[];
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function MaderasGrid({ maderas, onDelete }: MaderasGridProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ Aseguramos que maderas sea siempre un array
  const safeMaderas = Array.isArray(maderas) ? maderas : [];

  const handleDelete = async (id: string, nombre: string) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#78716c',
    });

    if (confirm.isConfirmed && onDelete) {
      setDeletingId(id);
      const result = await onDelete(id);
      setDeletingId(null);

      if (result.success) {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado correctamente...', 'success');
      } else {
        Swal.fire('Error', result.error || 'No se pudo eliminar el registro.', 'error');
      }
    }
  };

  const toggleVideo = (id: string) => {
    if (activeVideoId === id) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {safeMaderas.map((madera, index) => {
        const isVideoVisible = hoveredId === madera._id || activeVideoId === madera._id;

        return (
          <motion.div
            key={madera._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800"
            onMouseEnter={() => setHoveredId(madera._id)}
            onMouseLeave={() => {
              setHoveredId(null);
              setActiveVideoId(null);
            }}
          >
            <div 
              className="relative aspect-[4/3] overflow-hidden bg-stone-200 cursor-pointer"
              onClick={() => toggleVideo(madera._id)}
            >
              {/* ✅ Validación de thumbnailUrl para evitar crash de Next/Image */}
              {madera.thumbnailUrl && (
                <Image
                  src={madera.thumbnailUrl}
                  alt={madera.tituloProceso || 'Madera'}
                  fill
                  className={`object-cover transition-all duration-700 ease-in-out ${
                    isVideoVisible ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                  }`}
                />
              )}

              {madera.videoUrl && (
                <video
                  src={madera.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                    isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              )}

              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                isVideoVisible ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {madera.destacado && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  DESTACADO
                </div>
              )}

              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
                isVideoVisible ? 'opacity-100' : 'opacity-0'
              }`} />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                  {madera.nombreMadera || 'Madera'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                {madera.tituloProceso || 'Proceso'}
              </h3>

              <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-2">
                {madera.descripcion || 'Sin descripción'}
              </p>

              <div className="border-t border-stone-200 dark:border-stone-800 pt-4 mt-4">
                <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-500 uppercase mb-2">
                  Ficha Técnica
                </h4>
                <ul className="text-sm text-stone-700 dark:text-stone-300 space-y-1">
                  <li className="flex justify-between">
                    <span className="text-stone-500">Densidad:</span>
                    {/* ✅ Encadenamiento opcional para evitar crash */}
                    <span className="font-medium">{madera.especificaciones?.densidad || 'Consultar'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-stone-500">Uso:</span>
                    {/* ✅ Encadenamiento opcional para evitar crash */}
                    <span className="font-medium">{madera.especificaciones?.usoRecomendado || 'Consultar'}</span>
                  </li>
                </ul>
              </div>

              {isAdmin && (
                <div className="flex flex-wrap justify-between items-center gap-2 pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
                  <Link
                    href={`/admin/maderas/${madera._id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(madera._id, madera.nombreMadera || 'Registro');
                    }}
                    disabled={deletingId === madera._id}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {deletingId === madera._id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}