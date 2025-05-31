// components/banner/Banner.jsx
'use client';
import Image from "next/image";
import { FaTools, FaTree, FaHandsHelping } from "react-icons/fa";

function CarpinteriaBanner() {
  return (
    <div className="relative w-full h-[450px] bg-amber-800 overflow-hidden flex items-center justify-center">
      {/* Imagen de fondo de madera */}
      <Image
        src="/logo-carpinteria.png" // Imagen con textura de madera en /public
        width={1200}
        height={450}
        alt="Fondo Carpintería"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        priority
      />

      {/* Overlay con degradado cálido */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-yellow-800/60"></div>

      {/* Contenido del banner */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-serif">
          Carpintería Rubilar.s
        </h1>
        <p className="text-lg sm:text-2xl mb-8 max-w-2xl">
          Muebles a medida, restauración y diseño en madera natural. Calidad artesanal con alma patagónica.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = "/trabajos-realizados"}
            className="bg-white text-amber-900 px-6 py-3 rounded font-semibold hover:bg-yellow-200 transition duration-300"
          >
            Ver Trabajos
          </button>
          <button
            onClick={() => window.location.href = "/contacto"}
            className="bg-transparent border-2 border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-amber-900 transition duration-300"
          >
            Pedí tu Presupuesto
          </button>
        </div>

        {/* Iconos de valores */}
        <div className="flex justify-center gap-8 mt-10">
          <div className="flex flex-col items-center">
            <FaTree className="text-3xl mb-2" />
            <span className="text-sm">Madera Natural</span>
          </div>
          <div className="flex flex-col items-center">
            <FaTools className="text-3xl mb-2" />
            <span className="text-sm">Trabajo Artesanal</span>
          </div>
          <div className="flex flex-col items-center">
            <FaHandsHelping className="text-3xl mb-2" />
            <span className="text-sm">Atención Personalizada</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarpinteriaBanner;