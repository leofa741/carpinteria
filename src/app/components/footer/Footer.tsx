'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "Carpintería Rubilar.s";

  return (
 <footer 
  className="bg-amber-800 text-white relative"
  style={{ 
    backgroundImage: "url('/img/fondo-madera.jpg')", 
    backgroundSize: 'cover', 
    backgroundPosition: 'center' 
  }}
>
  {/* Overlay oscuro para mejorar legibilidad */}  
  <div className="absolute inset-0 bg-amber-900/90"></div>

  {/* Contenido principal - siempre arriba gracias a z-10 */}
  <div className="container mx-auto px-4 py-12 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Logo + Descripción */}  
      <div>
        <h3 className="text-xl font-bold mb-4">Carpintería Rubilar.s</h3>
        <p className="text-sm text-gray-300">
          Tu tienda online de confianza para muebles a medida y diseño de interiores. ¡Compra segura y rápida!
        </p>
      </div>

      {/* Categorías populares */}  
      <div>
        <h3 className="text-lg font-semibold mb-4">Categorías</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li><Link href="/trabajos-realizados" className="hover:text-white transition">Muebles de Sala</Link></li>
          <li><Link href="/contact" className="hover:text-white transition">Contáctanos</Link></li>
          <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
          <li><Link href="/login" className="hover:text-white transition">Iniciar Sesión</Link></li>
        </ul>
      </div>

      {/* Ayuda y Soporte */}  
      <div>
        <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li><Link href="/contact" className="hover:text-white transition">Contáctenos</Link></li>
        </ul>
      </div>

      {/* Contacto y Redes Sociales */}  
      <div>
        <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
        <div className="flex space-x-4 mb-4">
          <Link
            href="https://www.instagram.com/carpinteriarubilar/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src="./img/instagram_1.png"
              alt="Instagram"
              className="w-10 h-10 hover:opacity-80 transition"
            />
          </Link>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Contáctanos</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            <Link
              href="https://api.whatsapp.com/send?phone=542944412756&text=Hola,%20me%20interesa%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center"
            >
              <img
                src="./img/whatsapp.png"
                alt="WhatsApp"
                className="w-6 h-6 mr-2"
              />
              WhatsApp
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>

  {/* Barra inferior - derechos reservados */}  
  <div className="bg-amber-900 py-4 text-center text-sm text-gray-400 border-t border-gray-700 relative z-10">
    <p>&copy; {currentYear} {companyName}. Todos los derechos reservados.</p>
    <p className="mt-1">
      Creado por{' '}
      <Link
        href="https://www.tumarca.ar"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        TuMarca.ar
      </Link>
    </p>
  </div>
</footer>
  );
};

export default Footer;