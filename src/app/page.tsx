import Banner from "./components/baner/Banner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carpintería Rubilar.s - Muebles a Medida",
  description:
    "Bienvenido a Carpintería Rubilar.s, donde creamos muebles a medida con un diseño excepcional y una calidad inigualable. Explora nuestra amplia gama de productos y transforma tu espacio con estilo.",
  keywords:
    "muebles a medida, carpintería, diseño de interiores, muebles personalizados, decoración, calidad, estilo, hogar",
};


// app/page.tsx
export default function Home() {
  return (
    <>
      <div className="relative ">
        <Banner />
      </div>
  
{/* Sección de Bienvenida Mejorada */}
<section className="bg-[#fdfaf6] py-20">
  <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">

    {/* Texto descriptivo */}
    <div className="md:w-1/2 text-center md:text-left">
      <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        Bienvenido a <span className="text-amber-700">Carpintería Rubilar</span>
      </h2>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Donde cada detalle importa. Creamos muebles a medida con diseños únicos y materiales de alta calidad.
      </p>
      <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Transformamos espacios con piezas artesanales hechas pensando en tu estilo de vida y necesidades específicas.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <a
          href="/trabajos-realizados"
          className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
        >
          Explorar Proyectos
        </a>
        <a
          href="/contact"
          className="bg-white hover:bg-gray-100 text-amber-700 border border-amber-700 font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
        >
          Solicitar Presupuesto
        </a>
      </div>
    </div>

    {/* Imagen o ilustración */}
    <div className="md:w-1/2 flex justify-center">
      <img
        src="/img/armario.jpg" // Reemplaza con una imagen real
        alt="Muebles a medida Carpintería Rubilar"
        className="rounded-xl shadow-xl max-w-full h-auto object-cover border-4 border-white transition-transform duration-700 hover:scale-105"
      />
    </div>

  </div>
</section>



    </>
  );
}