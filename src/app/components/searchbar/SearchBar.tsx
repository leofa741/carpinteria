// app/components/searchbar/SearchBar.tsx (o donde tengas tu barra de búsqueda)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirige a la página de resultados de búsqueda
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="lg:flex flex-grow mx-2">
      <form onSubmit={handleSearch} className="flex bg-gray-100 rounded-full items-center ">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className=" bg-transparent px-2 py-2 outline-none"
        />
        <button type="submit" className="bg-amber-800 text-white px-4 py-2 rounded-full">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
}