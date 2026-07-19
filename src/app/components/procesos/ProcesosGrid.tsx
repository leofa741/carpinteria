'use client';

import { useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Paso {
    orden: number;
    titulo: string;
    descripcion: string;
    mediaUrl: string;
    tipoMedia: 'video' | 'imagen';
}

interface Proceso {
    _id: string;
    tituloProyecto: string;
    descripcionGeneral: string;
    clienteOtipo?: string;
    pasos: Paso[];
    destacado: boolean;
}

interface ProcesosGridProps {
    procesos: Proceso[];
    onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function ProcesosGrid({ procesos, onDelete }: ProcesosGridProps) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, titulo: string) => {
        const confirm = await Swal.fire({
            title: `¿Eliminar "${titulo}"?`,
            text: 'Esta acción no se puede deshacer y eliminará todos los pasos asociados.',
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {procesos.map((proceso) => {
                const primerPaso = proceso.pasos?.[0];

                return (
                    <div
                        key={proceso._id}
                        className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                    >
                        {/* El Link cubre todo el contenido visual, pero NO los botones de admin */}
                        <Link href={`/procesos/${proceso._id}`} className="flex-grow">
                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 dark:bg-stone-800">
                                {primerPaso?.mediaUrl ? (
                                    primerPaso.tipoMedia === 'video' ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 text-white transition-transform duration-700 group-hover:scale-105 p-6">
                                            {/* Icono principal de Story Time - Combinación de video + proceso */}
                                            <div className="relative mb-4">
                                                {/* Círculo de fondo con animación */}
                                                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>

                                                {/* Icono de video principal */}
                                                <div className="relative bg-stone-800/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-700 shadow-2xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>

                                                {/* Badge de pasos flotante */}
                                                <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    {proceso.pasos?.length || 0}
                                                </div>
                                            </div>

                                            {/* Texto principal */}
                                            <span className="text-base font-bold text-white mb-1 tracking-wide">Story Time</span>
                                            <span className="text-xs font-medium text-stone-400 text-center">
                                                {proceso.pasos?.length || 0} pasos del proceso
                                            </span>

                                            {/* Línea de tiempo visual */}
                                            <div className="flex items-center gap-1 mt-4">
                                                {[...Array(Math.min(proceso.pasos?.length || 1, 4))].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? 'w-6 bg-amber-500' : 'w-3 bg-stone-700'
                                                            }`}
                                                    ></div>
                                                ))}
                                                {(proceso.pasos?.length || 0) > 4 && (
                                                    <span className="text-xs text-stone-500 ml-1">+{(proceso.pasos?.length || 0) - 4}</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Image
                                            src={primerPaso.mediaUrl}
                                            alt={proceso.tituloProyecto}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            unoptimized
                                        />
                                    )
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">Sin vista previa</span>
                                    </div>
                                )}

                                {proceso.destacado && (
                                    <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                        DESTACADO
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg flex items-center gap-2">
                                        <span>Ver Story Time</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 line-clamp-1">
                                    {proceso.tituloProyecto}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 mb-4">
                                    {proceso.descripcionGeneral}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider border-t border-stone-100 dark:border-stone-800 pt-4">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        {proceso.pasos?.length || 0} Pasos
                                    </span>
                                    <span>•</span>
                                    <span className="truncate">{proceso.clienteOtipo || 'Proyecto Interno'}</span>
                                </div>
                            </div>
                        </Link>

                        {/* ✅ BOTONES DE ADMIN: Solo se renderizan si isAdmin es true */}
                        {isAdmin && (
                            <div className="flex flex-wrap justify-between items-center gap-2 px-6 pb-6 pt-2 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                                <Link
                                    href={`/admin/procesos/editar/${proceso._id}`}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                                >
                                    ✏️ Editar
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que el clic se propague al Link padre
                                        handleDelete(proceso._id, proceso.tituloProyecto);
                                    }}
                                    disabled={deletingId === proceso._id}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                                >
                                    {deletingId === proceso._id ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}