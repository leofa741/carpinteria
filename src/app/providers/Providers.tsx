// app/providers/Providers.tsx
'use client'; // Marcar este archivo como Client Component


import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { LoadingProvider } from '../context/LoadingContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
   
        <CartProvider>
        <LoadingProvider>
          {children}
          </LoadingProvider>
          </CartProvider>
     
      </AuthProvider>
    </SessionProvider>
  );
}