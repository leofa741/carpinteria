/* eslint-disable */
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
    img: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Cargar datos desde la API
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        setFormData({
          name: user.name || '',
          lastName: user.lastName || '',
          address: user.address || '',
          city: user.city || '',
          zipCode: user.zipCode || '',
          email: user.email || '',
          phone: user.phone || '',
          img: user.img || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
        toast.error('Error al cargar los datos del perfil');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prevData) => ({
        ...prevData,
        img: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('zipCode', formData.zipCode);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (imageFile) formDataToSend.append('img', imageFile);

      const response = await fetch('/api/user', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      toast.success('Perfil actualizado con éxito');
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="py-8 bg-gray-900 text-white text-center shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">Editar Perfil</h1>
      </header>

      <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'lastName', 'address', 'city', 'zipCode', 'email', 'phone'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field === 'lastName' ? 'Apellido' : field === 'phone' ? 'Teléfono' : field}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                id={field}
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                required={field !== 'phone'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          ))}

          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Imagen de perfil</label>
            <div className="flex items-center space-x-4 mt-2">
              {formData.img && (
                <img 
                  src={formData.img} 
                  alt="Vista previa" 
                  className="w-20 h-20 rounded-full object-cover border border-gray-300" 
                />
              )}
              <input
                type="file"
                id="img"
                name="img"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/profile')} 
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
