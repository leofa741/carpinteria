'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '',
    category: '',
  });

  const [price, setPrice] = useState<string>(''); // Price formateado como texto
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '');
    if (raw && !isNaN(Number(raw))) {
      const formatted = new Intl.NumberFormat('es-CL').format(Number(raw));
      setPrice(formatted);
    } else {
      setPrice('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPrice = parseInt(price.replace(/\./g, ''), 10); // Convertir el string formateado a número

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    form.append('price', cleanPrice.toString()); // Agregar el precio limpio como string

    if (image) {
      form.append('image', image);
    }

    const res = await fetch('/api/products', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Producto creado!',
        text: 'El producto fue creado correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({
        name: '',
        description: '',
        stock: '',
        category: '',
      });
      setPrice('');
      setImage(null);

      setTimeout(() => {
        router.push('/shop');
      }, 2000);
    } else {
      const error = await res.text();
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: error,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Crear producto</h1>

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
        placeholder="Precio (ej: 39.990)"
        value={price}
        onChange={handlePriceChange}
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
        <option value="">All Categories</option>
        <option value="Librería">Librería</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Juguetería">Juguetería</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Hogar">Hogar</option>
        <option value="Ropa">Ropa</option>
        <option value="Jardinería">Jardinería</option>
        <option value="Deportes">Deportes</option>
      </select>

      <input
        type="file"
        onChange={handleImageChange}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Crear
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
