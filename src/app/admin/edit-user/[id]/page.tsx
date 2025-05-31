'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditUserPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<null | {
    name: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    email: string;
    phone: string;
    role: string;
    img: string;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const token = session?.user?.token || localStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('token', token);
        }

        if (!token) {
          setError('No se encontró el token.');
          router.push('/');
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role !== 'admin') {
          router.push('/');
          return;
        }

        const response = await fetch(`/api/admin/users?id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener el usuario');
        }

        const data = await response.json();
        setUser({
          name: data.name || '',
          lastName: data.lastName || '',
          address: data.address || '',
          city: data.city || '',
          zipCode: data.zipCode || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || '',
          img: data.img || '',
        });
      } catch (err: unknown) {
        let errorMessage = 'Ocurrió un error inesperado.';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser(prev => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token.');
        return;
      }

      const formData = new FormData();
      formData.append('name', user!.name);
      formData.append('lastName', user!.lastName);
      formData.append('address', user!.address);
      formData.append('city', user!.city);
      formData.append('zipCode', user!.zipCode);
      formData.append('phone', user!.phone);
      formData.append('role', user!.role);

      const imgFile = (e.currentTarget.querySelector('#img') as HTMLInputElement)?.files?.[0];
      if (imgFile) {
        formData.append('img', imgFile);
      }

      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el usuario');
      }

      toast.success('Usuario actualizado con éxito');
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: unknown) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!user) return null; // 🛑 Evitar mostrar inputs vacíos antes de tener data

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <br /><br />
      <header className="py-8 bg-gray-900 text-white text-center shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">Editar Usuario</h1>
      </header>

      <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleUpdateUser} className="space-y-6">

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Correo Electrónico (bloqueado) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              disabled
              className="input-style bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={user.city}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Código Postal */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Código Postal</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={user.zipCode}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="input-style"
            />
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              className="input-style"
            />
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              required
              className="input-style"
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="w-full py-2 px-4 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>

        </form>
      </section>

      <ToastContainer />
    </div>
  );
}
