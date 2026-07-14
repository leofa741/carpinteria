 'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";






export default function NotAuthorized() {

const router = useRouter();

// redirigir automaticamente a la galeria 

useEffect(() => {
    router.push('/maderas');
}, []);

  return (

    <div className="flex items-center justify-center h-screen">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          No Autorizado
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8">
          No tenés permisos para acceder a esta página.
        </p>
      </div>
    </div>
  );
}