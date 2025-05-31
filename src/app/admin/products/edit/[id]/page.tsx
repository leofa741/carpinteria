'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const product = await res.json();

        if (res.ok) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            stock: product.stock?.toString() || '',
            category: product.category || '',
          });
        } else {
          Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo cargar el producto.';
        Swal.fire('Error', `Error al cargar el producto: ${message}`, 'error');
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'price') {
        const cleanPrice = parseInt(value.replace(/[^0-9]/g, ''), 10);
        form.append(key, cleanPrice.toString());
      } else {
        form.append(key, value);
      }
    });

    if (image) form.append('image', image);

    const res = await fetch(`/api/products?id=${id}`, {
      method: 'PUT',
      body: form,
    });

    if (res.ok) {
      Swal.fire('Éxito', 'Producto actualizado correctamente', 'success').then(() => {
        router.push('/shop');
      });
    } else {
      const error = await res.text();
      Swal.fire('Error', `Error al actualizar el producto: ${error}`, 'error');
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, quedarme',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/shop');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Editar producto</h1>

      <input
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="price"
        type="text"
        placeholder="Precio (ej: 39990)"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Todas las categorías</option>
        <option value="Librería">Librería</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Juguetería">Juguetería</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Hogar">Hogar</option>
        <option value="Ropa">Ropa</option>
        <option value="Jardinería">Jardinería</option>
        <option value="Deportes">Deportes</option>
      </select>

      <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded" />

      <div className="flex justify-between">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
