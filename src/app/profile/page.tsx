/* eslint-disable */
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';

interface UserData {
  name: string;
  lastName: string;
  address?: string;
  city?: string;
  zipCode?: string;
 

  

  email: string;
  phone?: string;
  img?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data: { user: UserData }) => {
          setUserData(data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener el perfil:', error);
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Cerrarás tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      signOut({ callbackUrl: '/' });
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="py-8 bg-gray-900 text-white text-center shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">Mi Perfil</h1>
      </header>

      <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4">
          {userData?.img ? (
            <Image
              src={userData.img}
              alt="Foto de perfil"
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-gray-300"
              priority
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-4xl text-gray-500">📷</span>
            </div>
          )}

          <h2 className="text-2xl font-bold">
            {userData?.name || 'Nombre no disponible'} {userData?.lastName || ''}
          </h2>

          <p className="text-gray-600">{userData?.email || 'Correo no disponible'}</p>
          <p className="text-gray-600">{userData?.phone ? `Teléfono: ${userData.phone}` : 'Teléfono no disponible'}</p>
          <p className="text-gray-600">{userData?.address ? `Dirección: ${userData.address}` : 'Dirección no disponible'}</p>
          <p className="text-gray-600">{userData?.city ? `Ciudad: ${userData.city}` : 'Ciudad no disponible'}</p>
          <p className="text-gray-600">{userData?.zipCode ? `Código Postal: ${userData.zipCode}` : 'Código Postal no disponible'}</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/profile/edit"
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Editar Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
