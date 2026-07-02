'use client'; // Indica que este es un componente del lado del cliente

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | string;
  img?: string;
  token?: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession(); // Obtener datos de la sesión desde next-auth
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para manejar la carga
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

 
  useEffect(() => {
    if (status === 'loading') return;

    const token = session?.user?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (token) {
      fetchUsers(token);
    } else {
      toast.error('Token de autenticación no encontrado');
      router.push('/');
    }
  }, [session, status, router]);

  const fetchUsers = async (token: string) => {
    setIsLoading(true); // Iniciar la carga
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        throw new Error('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      toast.error('Hubo un error al cargar los usuarios');
    } finally {
      setIsLoading(false); // Finalizar la carga
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const token = session?.user?.token || localStorage.getItem('token');

    if (!token) {
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    // Evitar que el usuario se elimine a sí mismo
    if (userId === session?.user?.id) {

      toast.error('No puedes eliminar tu propia cuenta.');
      return;
     
    }

    // Confirmación de eliminación
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      toast.success('Usuario eliminado con éxito');
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Hubo un error al eliminar el usuario');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Administrar Usuarios</h1>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Cargando...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">No hay usuarios registrados.</p>
        </div>
      ) : null}

      {/* Vista tipo tarjetas para pantallas pequeñas */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <div key={user._id} className="border rounded-lg shadow-md p-4 bg-white">
            <div className="flex items-center space-x-4">
              {user.img ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.img}
                    alt={`Imagen de ${user.name}`}
                    fill
                    sizes="3rem"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <span className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">Sin</span>
              )}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <p className="text-sm"><strong>ID:</strong> {user._id}</p>
            <p className="text-sm"><strong>Rol:</strong> {user.role}</p>
            <div className="flex gap-2 mt-2">
              <Link
                href={`/admin/edit-user/${user._id}`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm text-center"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="border-separate border-spacing-2 min-w-full bg-gray-900 shadow-md rounded-md">
          <thead className="bg-gray-900">
            <tr>
             
              <th className="p-4 text-left text-sm">Foto</th>
              <th className="p-4 text-left text-sm">Nombre</th>
              <th className="p-4 text-left text-sm">Apellido</th>
              <th className="p-4 text-left text-sm">Dirección</th>
              <th className="p-4 text-left text-sm">Ciudad</th>
              <th className="p-4 text-left text-sm">Código Postal</th>
              <th className="p-4 text-left text-sm">Teléfono</th>
              <th className="p-4 text-left text-sm">Correo</th>
              <th className="p-4 text-left text-sm">Rol</th>
              <th className="p-4 text-left text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
               
                 
                <td className="p-4">
                  {user.img ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={user.img}
                        alt={`Imagen de ${user.name}`}
                        fill
                        sizes="2.5rem"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <span className="text-sm">Sin imagen</span>
                  )}
                </td>
                <td className="p-4 text-xs">{user.name}</td>
                <td className="p-4 text-xs">{user.lastName}</td>
                <td className="p-4 text-xs">{user.address}</td>
                <td className="p-4 text-xs">{user.city}</td>
                <td className="p-4 text-xs">{user.zipCode}</td>
                <td className="p-4 text-xs">{user.phone}</td>
                <td className="p-4 text-xs break-all">{user.email}</td>
                <td className="p-4 text-xs capitalize">{user.role}</td>
                <td className="p-4 flex gap-2">
                  <Link
                    href={`/admin/edit-user/${user._id}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm text-center"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}