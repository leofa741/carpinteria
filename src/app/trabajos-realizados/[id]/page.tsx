'use client';

import {  useEffect, useState } from 'react';
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

// Función para obtener el índice anterior y siguiente
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
 

  const resolvedParams = React.use(params); // Desempaquetamos params
  const { id } = resolvedParams;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trabajos');
        const data = await res.json();
        setAllTrabajos(data);

        const found = data.find((t: Trabajo) => t._id === id);
        if (!found) {
          notFound(); // Muestra página 404 si no existe
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

  if (loading || !trabajo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Cargando detalles del trabajo...</p>
      </div>
    );
  }

  const { prev, next } = getNavigation(allTrabajos, id);

  if (!trabajo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Trabajo no encontrado.</p>
      </div>
    );
  }


  
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {/* Volver */}
        <Link href="/trabajos-realizados" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a todos los trabajos
        </Link>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-2">{trabajo.titulo}</h1>
        <p className="text-sm text-gray-500 mb-4">Categoría: {trabajo.categoria}</p>

        {/* Descripción */}
        <p className="text-gray-700 mb-6">{trabajo.descripcion}</p>

        {/* Galería de imágenes */}
        <h2 className="text-2xl font-semibold mb-4">Galería de Imágenes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {trabajo.imagenes.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded overflow-hidden shadow"
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

        {/* Navegación anterior / siguiente */}
        <div className="flex justify-between mt-8">
          {prev ? (
            <Link
              href={`/trabajos-realizados/${prev._id}`}
              className="text-blue-600 hover:underline"
            >
              ← {prev.titulo}
            </Link>
          ) : (
            <div></div>
          )}

          {next ? (
            <Link
              href={`/trabajos-realizados/${next._id}`}
              className="text-blue-600 hover:underline"
            >
              {next.titulo} →
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </motion.div>
    </main>
  );
}