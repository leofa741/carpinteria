// app/search/page.tsx
import { Suspense } from 'react';
import SearchResults from  './SearchResults';

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <SearchResults />
    </Suspense>
  );
}