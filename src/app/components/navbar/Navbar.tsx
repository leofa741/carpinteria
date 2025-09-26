'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faXmark,
  faUser,
  faBoxes,
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@/app/context/AuthContext';
import SearchBar from '../searchbar/SearchBar';
import MobileSearchBar from '../mobilesearch/MobileSearchBar';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

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
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed top-0 w-full z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full px-4 lg:px-16 flex items-center justify-between py-3 relative">
        {/* Buscador en desktop */}
        <div className="hidden lg:flex flex-1">
          <SearchBar />
        </div>

        {/* Logo centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/logo-carpinteria.png"
              alt="Logo de Carpintería Rubilar"
              width={70}
              height={70}
              priority
            />
          </Link>
        </div>

        {/* Sección derecha - Escritorio */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/carpinteriarubilar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>

          {/* Admin Links */}
          {role === 'admin' && (
            <>
              <Link
                href="/admin"
                className="flex flex-col items-center text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
              <Link
                href="/admin/trabajos/nuevo"
                className="flex flex-col items-center text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
              >
                <FontAwesomeIcon icon={faBoxes} className="text-lg" />
                <span className="text-xs mt-1">Subir</span>
              </Link>
            </>
          )}

          {/* Auth */}
          {session ? (
            <>
              <Link
                href="/profile"
                className="flex flex-col items-center text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span className="text-xs mt-1">Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
              >
                Iniciar
              </Link>
              <Link
                href="/register"
                className="text-sm text-gray-600 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* Info usuario */}
          {session && (
            <div className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
              {name || email}
            </div>
          )}
        </div>

        {/* Menú móvil: íconos a la izquierda, hamburguesa a la derecha */}
        <div className="lg:hidden flex items-center space-x-4">
          <a
            href="https://www.instagram.com/carpinteriarubilar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-200"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-amber-800 dark:text-amber-300 focus:outline-none"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faXmark : faBars}
              className="text-2xl transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Navegación principal - Escritorio */}
      <div className="hidden lg:flex justify-center bg-amber-50 dark:bg-gray-800 py-2.5">
        <div className="flex space-x-8 font-medium text-gray-800 dark:text-amber-200">
          <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            Inicio
          </Link>
          <Link href="/trabajos-realizados" className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            Trabajos
          </Link>
          <Link href="/contact" className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            Contacto
          </Link>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 bg-amber-50 dark:bg-gray-800 py-4 shadow-lg mx-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <MobileSearchBar isMenuOpen={isMenuOpen} closeMenu={closeMenu} />

          <div className="space-y-2 px-4 mt-4">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/trabajos-realizados', label: 'Trabajos' },
              { href: '/contact', label: 'Contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            {role === 'admin' && (
              <>
                <Link
                  href="/admin/trabajos/nuevo"
                  onClick={closeMenu}
                  className="flex items-center py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faBoxes} className="mr-3 text-amber-600 dark:text-amber-300" />
                  Subir Trabajo
                </Link>
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-amber-600 dark:text-amber-300" />
                  Admin Usuario
                </Link>
              </>
            )}

            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-amber-600 dark:text-amber-300" />
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block py-3 px-4 rounded-lg text-gray-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}

            {session && (
              <div className="mt-3 pt-3 border-t border-amber-200 dark:border-gray-700 text-sm text-gray-600 dark:text-amber-300 px-4">
                <p className="font-medium">
                  {role === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
                <p className="truncate">{name || email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}