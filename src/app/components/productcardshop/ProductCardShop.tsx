'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import formatCurrency from '@/app/lib/formatcurrenci';
import StarRating from '../starrating/StarRating';

interface Product {
  _id: string;
  id: number;
  name: string;
  description: string;
  stock: number;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  cashDiscountEnabled?: boolean;
}

interface ProductCardShopProps {
  product: Product;
  isAdmin?: boolean;
  onDelete: (deletedProductId: string) => void;
}

const handleNotLoggedIn = () => {
  Swal.fire({
    title: '¡Inicia sesión!',
    text: 'Para calificar este producto, por favor inicia sesión.',
    icon: 'info',
    confirmButtonText: 'Ir a Iniciar Sesión',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/login';
    }
  });
};

const ProductCardShop = ({ product, isAdmin, onDelete }: ProductCardShopProps) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [cashDiscountEnabled, setCashDiscountEnabled] = useState(product.cashDiscountEnabled ?? false);

  const handleEdit = () => {
    router.push(`/admin/products/edit/${product._id}`);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      cashDiscountEnabled: product.cashDiscountEnabled,

    });
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/products?id=${product._id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          await Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
          onDelete(product._id);
        } else {
          Swal.fire('Error', 'Error al eliminar el producto', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al eliminar el producto', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 text-sm">
      <div className="relative mb-3 overflow-hidden group rounded">
        <Link href={`/detail/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain w-full h-48 transition-transform duration-500 group-hover:scale-115"
            placeholder="blur"
            blurDataURL={product.image}
          />
        </Link>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
          {product.category}
        </div>
      </div>

      <StarRating
        productId={product._id}
        currentRating={product.rating}
        reviewCount={product.reviews}
        isLoggedIn={!!session}
        onNotLoggedIn={handleNotLoggedIn}
      />

      <div className="text-center">
        <Link
          href={`/detail/${product._id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600"
        >
          {product.name} <span className="text-xs text-gray-500">ver características</span>
        </Link>

        <div className="mt-1 text-gray-700 text-sm">
          <span className="font-semibold text-lg">${formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="ml-2 text-xs line-through text-gray-500">
              ${formatCurrency(product.oldPrice)}
            </span>
          )}
          {cashDiscountEnabled && (
            <div className="text-green-600 text-xs font-medium mt-1">
              10% de descuento en efectivo
            </div>
          )}
        </div>

        <div className="mt-1 text-gray-700 text-sm">
          <span className="font-semibold">
            {product.stock > 0 ? 'En Stock' : 'Sin Stock'}
          </span>
        </div>

        {product.stock > 0 && (
  <div className="mt-3 flex justify-center">
    <button
      onClick={handleAddToCart}
      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold rounded-lg sm:rounded-full transition duration-300 shadow-md text-sm sm:text-base"
    >
      <FontAwesomeIcon icon={faShoppingCart} />
      <span className="hidden sm:inline">Agregar al carrito</span>
      <span className="sm:hidden">Añadir</span>
    </button>
  </div>
)}

        {isAdmin && (
          <>
            <div className="flex gap-4 mt-4 backdrop-blur-sm bg-white/10 p-4 rounded-2xl shadow-md border border-white/20">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold rounded-full transition duration-300 shadow-lg"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-full transition duration-300 shadow-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-2 text-left flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cashDiscountEnabled}
                onChange={async () => {
                  const newValue = !cashDiscountEnabled;
                  try {
                    const res = await fetch(`/api/products?id=${product._id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ cashDiscountEnabled: newValue }),
                    });

                    if (res.ok) {
                      setCashDiscountEnabled(newValue);
                    }
                  } catch (error) {
                    console.error('Error al actualizar el descuento:', error);
                  }
                }}
                className="accent-yellow-500"
                id={`discount-${product._id}`}
              />
              <label htmlFor={`discount-${product._id}`} className="text-gray-700">
                Activar 10% de descuento en efectivo
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCardShop;
