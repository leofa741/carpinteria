'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "Carpintería Rubilar.s";

  return (
    <footer className="bg-amber-800 text-white">
      
      {/* Sección principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo + Descripción */}
          <div>
            <h3 className="text-xl font-bold mb-4">Carpintería Rubilar.s</h3>
            <p className="text-sm text-gray-400">
              Tu tienda online de confianza para muebles a medida y diseño de interiores. ¡Compra segura y rápida!
            </p>
          </div>

          {/* Categorías populares */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/trabajos-realizados" className="hover:text-white transition">
                  Muebles de Sala
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda y Soporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-gray-400">            
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contáctenos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4 mb-4">
            
              <Link
                href="https://www.instagram.com/buenosairestech24 "
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-2xl hover:text-white transition" />
              </Link>
          
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Contáctanos</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li> <img
                  src="./img/whatsapp.png"
                  alt="WhatsApp"
                  className="w-10 h-10 hover:opacity-80 transition"
                />
                <Link
                  href="https://api.whatsapp.com/send?phone=5491134567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp
                </Link>
              </li>
          
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior - derechos reservados */}
      <div className="bg-amber-700 py-4 text-center text-sm text-gray-400 border-t border-gray-700">
        <p>&copy; {currentYear} {companyName}. Todos los derechos reservados.</p>
        <p className="mt-1">
          Creado por{' '}
          <Link
            href="https://www.puentesdigitales.com.ar/ "
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Puentes Digitales
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;