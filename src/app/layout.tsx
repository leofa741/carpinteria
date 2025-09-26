/* eslint-disable */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";

import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { Providers } from "./providers/Providers";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react"
import Loader from "./components/loading/Loader";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400"], // Podés elegir los pesos que quieras
});


export const metadata: Metadata = {
  title: "Carpintería Rubilar.s - Muebles a Medida",
  description:
    "Bienvenido a Carpintería Rubilar.s, donde creamos muebles a medida con un diseño excepcional y una calidad inigualable. Explora nuestra amplia gama de productos y transforma tu espacio con estilo.",
  keywords:
    "muebles a medida, carpintería, diseño de interiores, muebles personalizados, decoración, calidad, estilo, hogar",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
     <body className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} font-sans bg-[#fdfaf6] dark:bg-gray-900 transition-colors duration-300`}>

        <Providers>
          <header>
            <div className="pt-30">
              <Navbar />
            </div>
          </header>
          <main>
           
            {children}
           {/* Botón flotante de WhatsApp */}
<a
  href="https://wa.me/+542944412756?text=Hola,%20me%20interesa%20un%20producto"
  target="_blank"
  rel="noopener noreferrer"
  className="
    fixed bottom-6 right-6
    bg-gradient-to-r from-amber-800 to-red-800    
    rounded-full
    flex items-center justify-center
    w-12 h-12  /* Tamaño del fondo ajustado */
    transition-transform duration-300
    hover:scale-110
    z-50
    animate-bounce
  "
  aria-label="Chatea con nosotros por WhatsApp"
>
  <img 
    src="/logo-carpinteria.png" 
    alt="WhatsApp" 
  className="w-12 h-12"
  style={{ borderRadius: "50%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} // Estilo para el logo

  />
</a>


          <Loader />
        <Analytics />      
          <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          z-index={9999}
          limit={3}
          theme="light"
        />
          </main>
         
          <Footer />
        </Providers>
      </body>
    </html>
  );
}