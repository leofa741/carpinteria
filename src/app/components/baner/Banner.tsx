'use client';
import Image from "next/image";
import { FaTools, FaTree, FaHandsHelping } from "react-icons/fa";

function CarpinteriaBanner() {
  return (
    <div className="relative w-full min-h-[500px] sm:min-h-[650px] bg-amber-800 overflow-hidden flex items-center justify-center py-10">
      
      {/* Fondo de madera */}
      <Image
        src="/img/fondo-madera.jpg"
        width={1920}
        height={650}
        alt="Fondo Carpintería"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        priority
      />

      {/* Overlay con degradado cálido */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-yellow-800/60"></div>

      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 text-center">
        
        {/* Logo responsivo */}
        <Image
          src="/logo-carpinteria.png"
          alt="Logo Carpintería"
          width={200}
          height={200}
          className="mb-4 w-32 sm:w-48 h-auto object-contain max-w-[90%]"
        />

        <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-serif">
          Carpintería Rubilar.s
        </h1>
        
        <p className="text-lg sm:text-2xl mb-8 max-w-2xl">
          Muebles a medida, restauración y diseño en madera natural. Calidad artesanal con alma patagónica.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = "/trabajos-realizados"}
            className="bg-white text-amber-900 px-6 py-3 rounded font-semibold hover:bg-yellow-200 transition duration-300"
          >
            Ver Trabajos
          </button>
          <button
            onClick={() => window.location.href = "/contact"}
            className="bg-transparent border-2 border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-amber-900 transition duration-300"
          >
            Pedí tu Presupuesto
          </button>
        </div>

        {/* Iconos */}
        <div className="flex justify-center gap-8 mt-10 flex-wrap">
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
