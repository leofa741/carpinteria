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

  const pasosOrdenados = [...proceso.pasos].sort((a, b) => a.orden - b.orden);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
      
      {/* ✅ Zona Principal (Stage): aspect-[3/4] en móvil (vertical), aspect-video en desktop */}
      <div className="relative aspect-[3/4] md:aspect-video bg-stone-950 flex items-center justify-center">
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
                // object-contain asegura que el video se vea completo sin deformarse, 
                // llenando el espacio si es vertical, o con barras negras si es horizontal.
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

        {/* ✅ Overlay optimizado: Gradiente más suave y texto compacto para no tapar el video vertical */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 md:p-8 text-white pointer-events-none">
          <motion.div
            key={`text-${activeIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Paso {activePaso.orden} de {pasosOrdenados.length}
              </span>
            </div>
            
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 leading-tight drop-shadow-md">
              {activePaso.titulo}
            </h2>
            
            {/* line-clamp-3 en móvil para dar un poco más de espacio al texto sin invadir el video */}
            <p className="text-stone-200 text-xs md:text-base line-clamp-3 md:line-clamp-none max-w-2xl drop-shadow-sm">
              {activePaso.descripcion}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Línea de Tiempo / Navegación de Pasos */}
      <div className="p-4 md:p-6 bg-stone-50 dark:bg-stone-950">
        <h3 className="text-sm md:text-base font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          Secuencia del Proceso
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
          {pasosOrdenados.map((paso, index) => (
            <button
              key={paso.orden}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-28 md:w-40 p-2.5 md:p-3 rounded-xl border text-left transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-amber-600 border-amber-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-400'
              }`}
            >
              <span className="text-[10px] font-bold opacity-70 block mb-1">PASO {paso.orden}</span>
              <span className="text-xs md:text-sm font-semibold leading-tight block line-clamp-2">{paso.titulo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}