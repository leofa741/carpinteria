'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/spiner/Spiner';

interface Trabajo {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenes: string[];
}


export default function PortfolioPage() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const { data: session } = useSession();
  const { userRole } = useContext(AuthContext);

  const role = session?.user?.role || userRole;

  useEffect(() => {
    fetch('/api/trabajos')
      .then((res) => res.json())
      .then((data) => setTrabajos(data));
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar este trabajo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6b7280',
    });

    if (!confirm.isConfirmed) return;

    await fetch(`/api/trabajos?id=${id}`, { method: 'DELETE' });
    setTrabajos((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Título */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 tracking-tight text-gray-900 dark:text-white"
      >
        Nuestros Trabajos Realizados
      </motion.h1>

      {/* Botón de administrador */}
      <div className="text-center mb-12">
        {role === 'admin' && (
          <Link
            href="/admin/trabajos/nuevo"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-300"
          >
            <span>+</span> Agregar Nuevo Trabajo
          </Link>
        )}
      </div>

      {/* Grid de trabajos */}
      {trabajos.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trabajos.map((trabajo) => (
            <motion.div
              key={trabajo._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Carrusel de imágenes */}
              <div className="relative w-full h-60">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  effect="fade"
                  loop
                  className="w-full h-full"
                >
                  {trabajo.imagenes.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={img}
                        alt={`${trabajo.titulo} - Imagen ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <h2 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                  {trabajo.titulo}
                </h2>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-2">
                  {trabajo.categoria}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {trabajo.descripcion}
                </p>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href={`/trabajos-realizados/${trabajo._id}`}
                    className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    Ver detalles →
                  </Link>

                  {role === 'admin' && (
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/trabajos/${trabajo._id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(trabajo._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}