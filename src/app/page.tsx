import Banner from "./components/baner/Banner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carpintería Rubilar - Muebles a Medida con Artesanía y Estilo",
  description:
    "Diseñamos y fabricamos muebles a medida con madera de alta calidad, acabados artesanales y un enfoque 100% personalizado. Transformamos tus ideas en realidad.",
  keywords:
    "muebles a medida, carpintería artesanal, muebles personalizados, diseño de interiores, armarios empotrados, cocinas a medida, muebles de madera, Rubilar",
};

const ProjectCard = ({ title, description, image }: { title: string; description: string; image: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  </div>
);

const Testimonial = ({ text, author }: { text: string; author: string }) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-amber-600">
    <p className="text-gray-700 dark:text-gray-200 italic mb-3">"{text}"</p>
    <p className="font-semibold text-amber-700 dark:text-amber-400">— {author}</p>
  </div>
);

export default function Home() {
  return (
    <>
      <div className="relative">
        <Banner />
      </div>

      {/* Sección de Bienvenida */}
      <section className="bg-[#fdfaf6] dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Muebles a Medida con <span className="text-amber-700 dark:text-amber-400">Alma Artesanal</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              En Carpintería Rubilar, no solo fabricamos muebles: creamos piezas únicas que reflejan tu personalidad, optimizan tu espacio y duran generaciones.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Cada proyecto nace de una conversación contigo. Porque tu hogar merece lo mejor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/trabajos-realizados"
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 text-center"
              >
                Ver Proyectos Recientes
              </a>
              <a
                href="/contact"
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-400 border border-amber-700 dark:border-amber-600 font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 text-center"
              >
                Cotiza tu Mueble Hoy
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/img/armario.jpg"
              alt="Mueble a medida artesanal - Carpintería Rubilar"
              className="rounded-xl shadow-xl max-w-full h-auto object-cover border-4 border-white dark:border-gray-800 transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ¿Por qué <span className="text-amber-700 dark:text-amber-400">Carpintería Rubilar</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎨", title: "Diseño Personalizado", desc: "Trabajamos contigo desde el boceto hasta la instalación." },
              { icon: "🪵", title: "Materiales Premium", desc: "Maderas seleccionadas, herrajes de primera y acabados duraderos." },
              { icon: "🛠️", title: "Artesanía Local", desc: "Fabricamos en nuestro taller con atención al detalle." }
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-700 dark:text-amber-400 text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos Destacados */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Últimos Proyectos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubre cómo hemos transformado espacios con soluciones únicas y funcionales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="Cocina Integral"
              description="Diseño modernista con isla central y almacenamiento optimizado."
              image="/img/cocina.jpg"
            />
            <ProjectCard
              title="Armario Empotrado"
              description="Aprovechamiento total del espacio con acabados en roble."
              image="/img/armario.jpg"
            />
            <ProjectCard
              title="Escritorio Ejecutivo"
              description="Mueble a medida con cajoneras y cableado integrado."
              image="/img/escritorio.jpg"
            />
          </div>
          <div className="text-center mt-10">
            <a
              href="/trabajos-realizados"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
            >
              Ver Todos los Proyectos
            </a>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Testimonial
              text="El armario que hicieron para mi habitación superó todas mis expectativas. Calidad, diseño y puntualidad impecables."
              author="María G., Santiago"
            />
            <Testimonial
              text="Trabajar con Rubilar fue un placer. Entendieron exactamente lo que quería para mi oficina en casa."
              author="Carlos R., Valparaíso"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-amber-800 dark:bg-amber-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para transformar tu espacio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Agenda una consulta gratuita y recibe una propuesta personalizada sin compromiso.
          </p>
          <a
            href="/contact"
            className="bg-white text-amber-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-lg transition duration-300 inline-block"
          >
            Solicitar Presupuesto
          </a>
        </div>
      </section>
    </>
  );
}