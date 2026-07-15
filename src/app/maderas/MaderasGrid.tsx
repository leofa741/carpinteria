'use client';

import { useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  especificaciones?: Especificaciones;
  destacado?: boolean;
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

  // ✅ 1. DIAGNÓSTICO: Ver exactamente qué recibe el navegador
  useEffect(() => {
    console.log("🔍 DATOS RECIBIDOS EN EL CLIENTE:", maderas);
    console.log("🔍 CANTIDAD TOTAL DE MADERAS:", Array.isArray(maderas) ? maderas.length : 0);
  }, [maderas]);

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
        Swal.fire('¡Eliminado!', 'Registro eliminado correctamente.', 'success');
      } else {
        Swal.fire('Error', result.error || 'No se pudo eliminar.', 'error');
      }
    }
  };

  const toggleVideo = (id: string) => {
    setActiveVideoId(activeVideoId === id ? null : id);
  };

  // ✅ 2. RENDERIZADO SEGURO: Si una card falla, no rompe las demás
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {safeMaderas.map((madera) => {
        // Si falta el ID, saltamos para evitar errores de React
        if (!madera || !madera._id) return null;

        const isVideoVisible = hoveredId === madera._id || activeVideoId === madera._id;

        return (
          <div
            key={madera._id}
            className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 transition-all duration-300 hover:shadow-xl"
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
              {/* Imagen con fallback seguro */}
              {madera.thumbnailUrl ? (
                <Image
                  src={madera.thumbnailUrl}
                  alt={madera.tituloProceso || 'Madera'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-all duration-700 ease-in-out ${
                    isVideoVisible ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  unoptimized // ✅ AGREGADO: Evita errores de optimización de Next.js con URLs externas
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-300 text-stone-500">
                  Sin imagen
                </div>
              )}

              {/* Video con fallback seguro */}
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

              {/* Ícono de Play */}
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

              <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-3">
                {madera.descripcion || 'Sin descripción'}
              </p>

              <div className="border-t border-stone-200 dark:border-stone-800 pt-4 mt-4">
                <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-500 uppercase mb-2">
                  Ficha Técnica
                </h4>
                <ul className="text-sm text-stone-700 dark:text-stone-300 space-y-1">
                  <li className="flex justify-between">
                    <span className="text-stone-500">Densidad:</span>
                    <span className="font-medium">{madera.especificaciones?.densidad || 'Consultar'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-stone-500">Uso:</span>
                    <span className="font-medium">{madera.especificaciones?.usoRecomendado || 'Consultar'}</span>
                  </li>
                </ul>
              </div>

              {isAdmin && (
                <div className="flex flex-wrap justify-between items-center gap-2 pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
                  <Link
                    href={`/admin/maderas/${madera._id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(madera._id, madera.nombreMadera || 'Registro');
                    }}
                    disabled={deletingId === madera._id}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    {deletingId === madera._id ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}