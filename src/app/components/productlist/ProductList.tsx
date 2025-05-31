/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart as faHeartRegular, faStar as faStarSolid, faStarHalfAlt, faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/app/context/CartContext';
import formatCurrency from '@/app/lib/formatcurrenci';

interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
}

const ProductList = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=4'); // 👈 solo 4 productos
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id, // Mongo usa _id
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} className="text-yellow-500 mr-1" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500 mr-1" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="text-yellow-500 mr-1" />);
      }
    }
    return stars;
  };

  if (loading) return <p className="text-center py-8">Cargando productos...</p>;

  return (
    <div className="container mx-auto pt-12 pb-8">
      <h2 className="text-2xl font-bold text-center relative mb-8">
        <span className="bg-gray-200 px-4 py-1 rounded">Productos Recientes</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
            <Link href={`/detail/${product._id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
            </Link>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300" onClick={() => handleAddToCart(product)}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              
              </div>
            </div>
            
            <div className="p-4 text-center">
              <Link href={`/detail/${product._id}`}  className="block text-lg font-semibold text-gray-800 hover:text-blue-600">
                {product.name}
              </Link>
              <div className="flex justify-center items-center mt-2">
                <span className="text-xl font-bold text-gray-900">
                  ${formatCurrency(product.price)}
                  </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">${product.oldPrice}</span>
                )}
              </div>
              <div className="flex justify-center items-center mt-2 text-yellow-500">
                {renderStars(product.rating || 0)} {/* si rating viene nulo */}
                <span className="text-gray-600 ml-2">({product.reviews || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
