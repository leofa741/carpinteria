'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Tipos
interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenes: string[];
}

// Datos simulados por ID
const proyectos: Proyecto[] = [
  {
    id: 1,
    titulo: "Mesa de Roble Maciza",
    descripcion: "Mesa artesanal fabricada en madera de roble macizo con acabado natural. Diseñada para durar generaciones con un toque elegante y funcional.",
    categoria: "Muebles",
    imagenes: [
      "/img/mesa-roble.jpg",
      "/img/mesa-roble.jpg",
      "/img/mesa-roble.jpg"
    ]
  },
  {
    id: 2,
    titulo: "Armario Empotrado",
    descripcion: "Armario a medida para espacio reducido con puertas correderas de madera. Optimización de espacio y diseño moderno.",
    categoria: "Almacenamiento",
    imagenes: [
      "/img/armario.jpg",
      "/img/armario.jpg"
    ]
  },
  {
    id: 3,
    titulo: "Juego de Sillas Rusticas",
    descripcion: "Conjunto de 4 sillas hechas a mano con estilo rústico y detalles en hierro. Madera seleccionada y ensamblaje artesanal.",
    categoria: "Sillas",
    imagenes: [
      "/img/sillas.jpg",
      "/img/sillas.jpg",
      "/img/sillas.jpg"
    ]
  }
];

// Función para encontrar índices anterior y siguiente
function getNavigation(id: number) {
  const index = proyectos.findIndex(p => p.id === id);
  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? proyectos[index - 1] : null;
  const next = index < proyectos.length - 1 ? proyectos[index + 1] : null;

  return { prev, next };
}

export default function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params); // ✅ Desempaquetamos params con React.use()
  const id = parseInt(resolvedParams.id);
  const proyecto = proyectos.find(p => p.id === id);

  if (!proyecto) {
    notFound();
  }

  const { prev, next } = getNavigation(id);

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <Link href="/trabajos-realizados" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a todos los trabajos
        </Link>

        <h1 className="text-3xl font-bold mb-2">{proyecto.titulo}</h1>
        <p className="text-sm text-gray-500 mb-4">Categoría: {proyecto.categoria}</p>

        <p className="text-gray-700 mb-6">{proyecto.descripcion}</p>

        <h2 className="text-2xl font-semibold mb-4">Galería de Imágenes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {proyecto.imagenes.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded overflow-hidden shadow"
            >
              <Image
                src={src}
                alt={`${proyecto.titulo} - Imagen ${index + 1}`}
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
              href={`/trabajos-realizados/${prev.id}`}
              className="text-blue-600 hover:underline"
            >
              ← {prev.titulo}
            </Link>
          ) : (
            <div></div>
          )}

          {next ? (
            <Link
              href={`/trabajos-realizados/${next.id}`}
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