'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

interface Trabajo {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenes: string[];
}

function getNavigation(all: Trabajo[], currentId: string) {
  const index = all.findIndex(t => t._id === currentId);
  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  return { prev, next };
}

export default function DetalleTrabajoPage({ params }: { params: Promise<{ id: string }> }) {
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
  const [allTrabajos, setAllTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trabajos');
        const data = await res.json();
        setAllTrabajos(data);

        const found = data.find((t: Trabajo) => t._id === id);
        if (!found) {
          notFound();
        }

        setTrabajo(found);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 dark:text-gray-300 text-lg"
        >
          Cargando detalles del trabajo...
        </motion.div>
      </div>
    );
  }

  if (!trabajo) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-700 dark:text-gray-300">Trabajo no encontrado.</p>
      </div>
    );
  }

  const { prev, next } = getNavigation(allTrabajos, id);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Encabezado */}
        <div className="p-5 md:p-6">
          <Link
            href="/trabajos-realizados"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium mb-4 transition-colors"
          >
            ← Volver a todos los trabajos
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {trabajo.titulo}
          </h1>
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Categoría: {trabajo.categoria}
          </p>
        </div>

        {/* Descripción */}
        <div className="px-5 md:px-6 pb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {trabajo.descripcion}
          </p>
        </div>

        {/* Galería */}
        {trabajo.imagenes.length > 0 && (
          <div className="px-5 md:px-6 pb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Galería de Imágenes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trabajo.imagenes.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={src}
                    alt={`${trabajo.titulo} - Imagen ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-5 md:px-6 py-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {prev ? (
              <Link
                href={`/trabajos-realizados/${prev._id}`}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium flex items-center gap-2 transition-colors"
              >
                ← Anterior: {prev.titulo}
              </Link>
            ) : (
              <div></div>
            )}

            {next ? (
              <Link
                href={`/trabajos-realizados/${next._id}`}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium text-right flex items-center justify-end gap-2 transition-colors"
              >
                Siguiente: {next.titulo} →
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </motion.article>
      <div className="text-center mt-6">
  <Link href="/contact" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg">
    ¿Quieres un mueble así? ¡Contáctanos!
  </Link>
</div>
    </main>
  );
}