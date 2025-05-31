'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = searchParams.get('q');

      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        } else {
          console.error('Error al buscar productos:', data.error);
        }
      } catch (error) {
        console.error('Error al buscar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (products.length === 0) {
    return <p className="text-center">No se encontraron productos.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Resultados de la búsqueda</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
          >
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <Image
              src={product.image}
              alt={product.name}
              width={270}
              height={250}
              className="object-cover mb-4 mx-auto rounded-lg"
              priority={true}
              loading="eager"
            />
            <p className="text-gray-500">{product.category}</p>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}