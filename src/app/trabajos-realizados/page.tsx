'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Trabajo {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenes: string[];
}

export default function PortfolioPage() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);

  useEffect(() => {
    fetch('/api/trabajos')
      .then(res => res.json())
      .then(data => setTrabajos(data));
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar este trabajo?');
    if (!confirm) return;

    await fetch(`/api/trabajos?id=${id}`, { method: 'DELETE' });
    setTrabajos(prev => prev.filter(t => t._id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-semibold text-center mb-12 tracking-tight text-neutral-800"
      >
        Trabajos Realizados
      </motion.h1>

      <div className="text-center mb-10">
        <Link
          href="/admin/trabajos/nuevo"
          className="bg-black text-white px-5 py-3 rounded hover:bg-neutral-800 transition-colors"
        >
          + Nuevo Trabajo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {trabajos.map((trabajo) => (
          <motion.div
            key={trabajo._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200"
          >
            <div className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar">
              <div className="flex">
                {trabajo.imagenes.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    width={600}
                    height={400}
                    className="h-64 w-auto object-cover rounded-none inline-block"
                  />
                ))}
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-2xl font-medium mb-1 text-neutral-900">{trabajo.titulo}</h2>
              <p className="text-sm text-neutral-500 mb-1">{trabajo.categoria}</p>
              <p className="text-neutral-700 mb-4 line-clamp-3">{trabajo.descripcion}</p>

              <div className="flex justify-between items-center text-sm">
                <Link href={`/trabajos-realizados/${trabajo._id}`} className="text-blue-600 hover:underline">
                  Ver detalles →
                </Link>
                <div className="flex gap-4">
                  <Link href={`/admin/trabajos/${trabajo._id}`} 
                  className="text-green-700 hover:underline">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(trabajo._id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
