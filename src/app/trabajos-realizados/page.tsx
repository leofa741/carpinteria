'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Datos simulados de proyectos
interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  categoria: string;
}

const proyectos: Proyecto[] = [
  {
    id: 1,
    titulo: "Mesa de Roble Maciza",
    descripcion: "Mesa artesanal fabricada en madera de roble macizo con acabado natural.",
    imagenPrincipal: "/img/mesa-roble.jpg",
    categoria: "Muebles"
  },
  {
    id: 2,
    titulo: "Armario Empotrado",
    descripcion: "Armario a medida para espacio reducido con puertas correderas de madera.",
    imagenPrincipal: "/img/armario.jpg",
    categoria: "Almacenamiento"
  },
  {
    id: 3,
    titulo: "Juego de Sillas Rusticas",
    descripcion: "Conjunto de 4 sillas hechas a mano con estilo rústico y detalles en hierro.",
    imagenPrincipal: "/img/sillas.jpg",
    categoria: "Sillas"
  },
];

export default function PortfolioPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        Nuestros Trabajos Realizados
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12 max-w-2xl mx-auto text-gray-700"
      >
        Aquí puedes ver algunos de los proyectos de carpintería que hemos realizado con dedicación y calidad.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proyectos.map((proyecto) => (
          <motion.div
            key={proyecto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <Image
              src={proyecto.imagenPrincipal}
              alt={proyecto.titulo}
              width={600}
              height={400}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{proyecto.titulo}</h2>
              <p className="text-sm text-gray-500 mb-2">{proyecto.categoria}</p>
              <p className="text-gray-700 mb-4 line-clamp-2">{proyecto.descripcion}</p>
              <Link href={`/trabajos-realizados/${proyecto.id}`} className="text-blue-600 hover:underline">
                Ver detalles →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}