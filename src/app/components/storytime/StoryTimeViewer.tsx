'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IPaso } from '@/app/models/ProcesoTrabajo';

interface Proceso {
  _id: string;
  tituloProyecto: string;
  descripcionGeneral: string;
  clienteOtipo?: string;
  pasos: IPaso[];
}

export default function StoryTimeViewer({ proceso }: { proceso: Proceso }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePaso = proceso.pasos[activeIndex];

  // Ordenar pasos por número de orden por si acaso
  const pasosOrdenados = [...proceso.pasos].sort((a, b) => a.orden - b.orden);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
      {/* Zona Principal (Stage) */}
      <div className="relative aspect-video bg-stone-950 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePaso.mediaUrl}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {activePaso.tipoMedia === 'video' ? (
              <video
                src={activePaso.mediaUrl}
                controls
                className="w-full h-full object-contain bg-black"
                preload="metadata"
              />
            ) : (
              <Image
                src={activePaso.mediaUrl}
                alt={activePaso.titulo}
                fill
                className="object-contain bg-black"
                unoptimized
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay de información del paso activo */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-8 text-white">
          <motion.div
            key={`text-${activeIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-1 block">
              Paso {activePaso.orden} de {pasosOrdenados.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{activePaso.titulo}</h2>
            <p className="text-stone-300 text-sm md:text-base max-w-3xl">{activePaso.descripcion}</p>
          </motion.div>
        </div>
      </div>

      {/* Línea de Tiempo / Navegación de Pasos */}
      <div className="p-6 md:p-8 bg-stone-50 dark:bg-stone-950">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          Secuencia del Proceso
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
          {pasosOrdenados.map((paso, index) => (
            <button
              key={paso.orden}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-40 md:w-48 p-3 rounded-xl border text-left transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-amber-600 border-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-400 dark:hover:border-amber-700'
              }`}
            >
              <span className="text-xs font-bold opacity-70 block mb-1">PASO {paso.orden}</span>
              <span className="text-sm font-semibold leading-tight block">{paso.titulo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}