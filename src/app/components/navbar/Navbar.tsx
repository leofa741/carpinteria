'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faXmark, 
  faUser,
  faBoxes
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@/app/context/AuthContext';
import SearchBar from '../searchbar/SearchBar';
import MobileSearchBar from '../mobilesearch/MobileSearchBar';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Navbar() {
  const { data: session } = useSession();
  const { userRole, setUserRole, userName, userEmail } = useContext(AuthContext);
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  const handleLogout = () => {   
    signOut({ callbackUrl: '/' });
    localStorage.removeItem('token');
    localStorage.removeItem('purchaseData');
    localStorage.removeItem('cart');
    setUserRole('guest');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const role = session?.user?.role || userRole;
  const name = session?.user?.name || userName;
  const email = session?.user?.email || userEmail;

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-full px-4 lg:px-16 flex items-center justify-between py-3 relative">
        {/* Buscador en desktop */}
        <div className="hidden lg:flex flex-1">
          <SearchBar />
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image
              src="/logo-carpinteria.png"
              alt="Logo de Carpintería"
              width={70}
              height={70}
              priority
            />
          </Link>
        </div>

        {/* Sección derecha (Escritorio) */}
        <div className="hidden lg:flex space-x-4 items-center">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/carpinteriarubilar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>      
       

          {/* Links de admin */}
          {role === 'admin' && (
            <>
              <Link href="/admin" className="text-gray-600">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
                <span className="text-xs lg:text-sm ml-1">Admin Usuario</span>
              </Link>
              <Link href="/admin/trabajos/nuevo" className="text-gray-600">
                <FontAwesomeIcon icon={faBoxes} className="text-xl" />
                <span className="text-xs lg:text-sm ml-1">Subir Trabajo</span>
              </Link>
            </>
          )}

          {/* Autenticación */}
          {session ? (
            <>
              <Link href="/profile" className="text-gray-600">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
                <span className="text-xs lg:text-sm ml-1">Perfil</span>
              </Link>
              <button onClick={handleLogout} className="text-xs lg:text-sm text-gray-600 hover:text-red-600 transition duration-200
              
              ">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs lg:text-sm text-gray-600">
                Login
              </Link>
              <Link href="/register" className="text-xs lg:text-sm text-gray-600">
                Register
              </Link>
            </>
          )}

          {/* Info de usuario */}
          {session && (
            <div className="text-xs lg:text-sm text-gray-600">
              {role === 'admin' ? 'Admin' : 'Usuario'}: {name || email}
            </div>
          )}
        </div>

        {/* Menú móvil: carrito + redes sociales a la izquierda, menú a la derecha */}
        <div className="lg:hidden flex items-center justify-between w-full px-2">
          {/* Grupo de carrito + redes sociales */}
          <div className="flex  *:space-x-4 items-center">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/buenosairestech24"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-800 dark:text-yellow-200 hover:text-pink-500"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-lg" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61568409722975&rdid=evSQkLQw3CoYc6Ax&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1A4QeVXDyD%2F#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-800 dark:text-yellow-200 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
            </a>
          </div>

          {/* Botón menú hamburguesa */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-amber-800 dark:text-gray-200"
            aria-label="Abrir menú"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faXmark : faBars}
              className={`text-lg transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Menú de navegación en desktop */}
      <div className="hidden lg:flex justify-center bg-gray-100 py-2">
        <div className="flex space-x-6 font-bold text-black dark:text-yellow-200">
          <Link href="/" className="hover:text-amber-800">Inicio</Link>
          <Link href="/trabajos-realizados" className="hover:text-amber-800">Trabajos</Link> 
          <Link href="/contact" className="hover:text-amber-800">Contacto</Link>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-yellow-50 dark:bg-gray-800 py-4 shadow-md rounded-lg mx-2">
          <MobileSearchBar isMenuOpen={isMenuOpen} closeMenu={closeMenu} />

          <div className="space-y-2 px-4 mt-4">
            {[
              { href: "/", label: "Inicio" },
              { href: "/trabajos-realizados", label: "Trabajos" },
              { href: "/contact", label: "Contacto" }
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block py-2 px-3 rounded-lg hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-800 dark:text-yellow-200 transition"
              >
                {link.label}
              </Link>
            ))}



            {/* Admin */}
            {role === 'admin' && (
              <>
                <Link href="/admin/trabajos/nuevo" onClick={closeMenu} className="block py-2 px-3 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-yellow-200">
                  <FontAwesomeIcon icon={faBoxes} className="mr-2 text-lg" />
                  Subir Trabajo
                </Link>
                <Link href="/admin" onClick={closeMenu} className="block py-2 px-3 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-yellow-300">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-lg" />
                  Admin Usuario
                </Link>
              </>
            )}

            {/* Autenticación */}
            {session ? (
              <>
                <Link href="/profile" onClick={closeMenu} className="block py-2 px-3 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-yellow-200">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-lg" />
                  Perfil
                </Link>
                <button onClick={() => { closeMenu(); handleLogout(); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-800 dark:text-yellow-200 transition">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="block py-2 px-3 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-yellow-200">
                  Iniciar sesión
                </Link>
                <Link href="/register" onClick={closeMenu} className="block py-2 px-3 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-yellow-200">
                  Registrarse
                </Link>
              </>
            )}

            {/* Info usuario */}
            {session && (
              <div className="mt-4 text-sm text-gray-600 dark:text-yellow-300 font-medium px-3">
                {role === 'admin' ? 'Administrador' : 'Usuario'}: {email || name}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 