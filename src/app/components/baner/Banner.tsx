'use client';

import Link from "next/link";
import Image from "next/image";
import { FaTree, FaTools, FaHandsHelping, FaArrowRight } from "react-icons/fa";

function CarpinteriaBanner() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
      
      {/* 1. Fondo: Imagen sin optimización de servidor */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/fondo-madera.jpg"
          fill
          alt="Textura de madera patagónica"
          className="object-cover opacity-40 scale-105 animate-slow-zoom" 
          priority
          quality={100}
          unoptimized // <--- CLAVE: Evita el consumo de ancho de banda de optimización
        />
        {/* Degradado premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-stone-900/60 to-stone-950/90"></div>
        {/* Textura de ruido sutil */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* 2. Contenido Principal */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Logo con brillo sutil */}
        <div className="mb-8 relative group">
            <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Image
            src="/logo-carpinteria.png"
            alt="Logo Carpintería Rubilar"
            width={180}
            height={180}
            className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
            unoptimized // <--- CLAVE: Logo sin optimización
            />
        </div>

        {/* Títulos */}
        <h1 className="text-5xl md:text-7xl font-serif text-stone-100 mb-6 tracking-tight leading-tight">
          Carpintería <span className="text-amber-500 italic">Rubilar</span>
        </h1>
        
        <p className="text-stone-300 text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-10 border-l-2 border-amber-600 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
          Diseñamos muebles con alma patagónica. <br className="hidden md:block"/>
          Restauración y creación en madera nativa de Bariloche.
        </p>

        {/* Botones de Acción (CTA) */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link
            href="/trabajos-realizados"
            className="group relative px-8 py-4 bg-amber-700 text-white font-medium tracking-wide overflow-hidden rounded-sm transition-all hover:bg-amber-800 hover:shadow-[0_0_20px_rgba(180,83,9,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver Galería <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/contacto"
            className="px-8 py-4 bg-transparent border border-stone-500 text-stone-300 font-medium tracking-wide rounded-sm hover:border-white hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            Solicitar Presupuesto
          </Link>
        </div>

        {/* 3. Barra de Valores (Iconos) */}
        <div className="mt-16 pt-10 border-t border-white/10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem 
            icon={<FaTree />} 
            title="Madera Nativa" 
            desc="Ciprés y Coihue local" 
          />
          <FeatureItem 
            icon={<FaTools />} 
            title="Hecho a Mano" 
            desc="Técnicas tradicionales" 
          />
          <FeatureItem 
            icon={<FaHandsHelping />} 
            title="Trato Directo" 
            desc="Atención en Bariloche" 
          />
        </div>
      </div>
    </section>
  );
}

// Componente auxiliar para los iconos
function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group cursor-default">
      <div className="text-amber-500 text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300 bg-stone-900/50 p-3 rounded-full border border-white/5">
        {icon}
      </div>
      <h3 className="text-stone-200 font-serif text-lg mb-1">{title}</h3>
      <p className="text-stone-500 text-xs uppercase tracking-widest">{desc}</p>
    </div>
  );
}

export default CarpinteriaBanner;