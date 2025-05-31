'use client';

import { useMemo, useState, useEffect } from 'react';
import ProductCardShop from "../productcardshop/ProductCardShop";
import Pagination from '../pagination/Pagination';
import ShopHeader from '../shopheader/ShopHeader';
import ProductSkeleton from '../productskeleton/ProductSkeleton';
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';


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
}

const ProductListShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('latest');
  const [pageSize, setPageSize] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const searchParams = useSearchParams();
  const updated = searchParams.get('updated') === 'true';

  

  if (session?.user?.token) {
    // Guardamos el token en localStorage
    localStorage.setItem('token', session.user.token);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [updated]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (sort === 'popularity') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [sort, category, products]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);

  const handleWithLoading = (callback: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <ShopHeader
        sort={sort}
        pageSize={pageSize}
        view={view}
        category={category}
        onSortChange={(val) => handleWithLoading(() => {
          setSort(val);
          setCurrentPage(1);
        })}
        onPageSizeChange={(val) => handleWithLoading(() => {
          setPageSize(val);
          setCurrentPage(1);
        })}
        onViewChange={(val) => handleWithLoading(() => setView(val))}
        onCategoryChange={(val) => handleWithLoading(() => {
          setCategory(val);
          setCurrentPage(1);
        })}
      />

      {isLoading ? (
        <div className={`${view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'flex flex-col gap-4'}`}>
          {Array.from({ length: pageSize }).map((_, i) => (
            <ProductSkeleton key={i} view={view} />
          ))}
        </div>
      ) : (
        <div className={`${view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'flex flex-col gap-4'}`}>
          {currentProducts.map((product) => (
            <ProductCardShop
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              onDelete={(deletedId) => {
                handleWithLoading(() => {
                  setProducts((prev) => prev.filter((p) => p._id !== deletedId));
                });
              }}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => handleWithLoading(() => setCurrentPage(page))}
      />
    </>
  );
};

export default ProductListShop;
