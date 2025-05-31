import Banner from "./components/baner/Banner";
import Featured from "./components/featured/Featured";

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
      {/* Sección de productos destacados */}


      <section className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Productos Destacados
        </h2>
        <p className="text-lg text-gray-700 mb-3 leading-relaxed">
          Explora nuestra selección de productos destacados y encuentra lo último en tecnología.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          En <span className="font-semibold text-blue-600">Bs As Tech</span>, nos enorgullece ofrecerte una experiencia de compra excepcional. Desde gadgets innovadores hasta accesorios tecnológicos de alta calidad, tenemos todo lo que necesitas para estar a la vanguardia de la tecnología.
        </p>
      </section>

      <Featured />
      



    </>
  );
}//   www.bsastechshop.com.ar