'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import formatCurrency from '../lib/formatcurrenci';

const parsePrice = (price: unknown): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const parsed = parseFloat(price.replace(/\./g, '').replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.info('Debes iniciar sesión para ver tu carrito.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Tu carrito está vacío. Redirigiendo a la tienda...', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });

      const timer = setTimeout(() => {
        router.push('/shop');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [cartItems, router]);

  if (!isClient || status === 'loading') {
    return <p className="text-center text-gray-600">Cargando...</p>;
  }

  if (status === 'unauthenticated') return null;

  const total = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const descuento = cartItems.reduce((acc, item) => {
    if (item.cashDiscountEnabled) {
      return acc + parsePrice(item.price) * item.quantity * 0.1;
    }
    return acc;
  }, 0);

  const handleClearCart = () => {
    clearCart();
    toast.info('Carrito vacío. Redirigiendo a la tienda...', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
    setTimeout(() => {
      router.push('/shop');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <>
          <p className="text-gray-600">Tu carrito está vacío. Redirigiendo a la tienda...</p>
          <ToastContainer />
        </>
      ) : (
        <>
          {/* Vista móvil */}
          <div className="space-y-4 md:hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-3 border-b bg-white rounded-lg shadow-sm">
                <div className="w-full sm:w-20">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="rounded object-cover w-full h-auto aspect-square"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-24 rounded flex items-center justify-center text-xs text-gray-500">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    <Link href={`/detail/${item.id}`} className="hover:text-blue-600">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(parsePrice(item.price))}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                      className="w-16 px-2 py-1 border rounded-md text-center text-sm"
                    />
                    <span className="font-semibold text-gray-700">
                      {formatCurrency(parsePrice(item.price) * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                  <th className="p-3">Producto</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-4">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                      <Link href={`/detail/${item.id}`} className="text-gray-800 hover:text-blue-600">
                        {item.name}
                      </Link>
                    </td>

                    <td className="p-3">{formatCurrency(parsePrice(item.price))}</td>

                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                        className="w-16 px-2 py-1 border rounded-md text-center text-sm"
                      />
                    </td>

                    <td className="p-3">{formatCurrency(parsePrice(item.price) * item.quantity)}</td>

                    <td className="p-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales y botones */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t pt-6">
            <span className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Total: {formatCurrency(total)}
            </span>

            {descuento > 0 && (
              <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                Total con descuento: {formatCurrency(total - descuento)}
              </span>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClearCart}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Vaciar Carrito
              </button>

              <Link
                href="/checkout"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Ir al Pago
              </Link>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}
