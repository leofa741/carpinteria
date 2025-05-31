import DetailClient from '@/app/components/detailclient/DetailClient';
import { Metadata } from 'next';

interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  cashDiscountEnabled?: boolean;

}

async function fetchProductById(_id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?id=${_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generar metadata SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return <p className="text-center text-red-500">Producto no encontrado...</p>;
  }

  return <DetailClient product={product} />;
}