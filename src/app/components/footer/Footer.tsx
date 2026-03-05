'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp, FaArrowUp, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "Carpintería Rubilar";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-stone-950 text-stone-300 overflow-hidden">
      
      {/* Fondo con textura y overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/fondo-madera.jpg"
          alt="Textura madera"
          fill
          className="object-cover opacity-20"
          unoptimized // Para no consumir tu cuota de optimización
        />
        {/* Gradiente superior para transición suave con el contenido */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent"></div>
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-10">
        
        {/* Grid de 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Branding */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-stone-100">
              {companyName} <span className="text-amber-600">.</span>
            </h3>
            <p className="text-stone-400 leading-relaxed text-sm font-light">
              Muebles a medida con alma patagónica. Restauración y diseño en madera nativa de Bariloche. Calidad que perdura.
            </p>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 pt-2">
              <SocialLink 
                href="https://www.instagram.com/carpinteriarubilar/" 
                icon={<FaInstagram />} 
                label="Instagram" 
              />
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-stone-100 font-serif text-lg mb-6 border-b border-amber-900/50 pb-2 inline-block">
              Explorar
            </h4>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/trabajos-realizados">Galería de Trabajos</FooterLink>
              <FooterLink href="/">Inicio</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
              {/* Opcional: Si tienes blog o sobre nosotros */}
              {/* <FooterLink href="/nosotros">Nuestro Taller</FooterLink> */}
            </ul>
          </div>

          {/* Columna 3: Contacto Directo */}
          <div>
            <h4 className="text-stone-100 font-serif text-lg mb-6 border-b border-amber-900/50 pb-2 inline-block">
              Contacto
            </h4>
            <ul className="space-y-5 text-sm">
              <li>
                <a 
                  href="https://api.whatsapp.com/send?phone=542944412756&text=Hola,%20me%20interesa%20un%20producto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group hover:text-amber-500 transition-colors"
                >
                  <FaWhatsapp className="text-xl mt-1 text-green-600 group-hover:text-green-500 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">+54 294 441-2756</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-stone-400">
                <FaMapMarkerAlt className="text-xl mt-1 text-amber-600" />
                <span>Bariloche, Río Negro<br/>Patagonia Argentina</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter / CTA Suave */}
          <div>
            <h4 className="text-stone-100 font-serif text-lg mb-6 border-b border-amber-900/50 pb-2 inline-block">
              Novedades
            </h4>
            <p className="text-stone-400 text-sm mb-4 font-light">
              Recibe inspiración y novedades sobre nuestros trabajos en madera.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="bg-stone-900/50 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors placeholder:text-stone-600"
              />
              <button className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-3 text-sm font-medium transition-all duration-300 tracking-wide">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Divider Decorativo */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mb-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-light">
          <p>&copy; {currentYear} {companyName}. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-amber-500 cursor-pointer transition-colors" onClick={scrollToTop}>
              Volver arriba <FaArrowUp className="inline ml-1 text-[10px]" />
            </span>
            <Link href="https://www.tumarca.ar" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
              Desarrollado por TuMarca.ar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componentes auxiliares para limpiar el código principal

function FooterLink({ href, children }) {
  return (
    <li>
      <Link 
        href={href} 
        className="relative inline-block text-stone-400 hover:text-amber-500 transition-colors group"
      >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

export default Footer;