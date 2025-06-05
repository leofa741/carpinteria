'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Trabajo {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenPrincipal: string;
}

export default function AdminTrabajosPage() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTrabajos = async () => {
    setLoading(true);
    const res = await fetch('/api/trabajos');
    const data = await res.json();
    setTrabajos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrabajos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este trabajo?')) return;

    const res = await fetch(`/api/trabajos?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setTrabajos((prev) => prev.filter((trabajo) => trabajo._id !== id));
    } else {
      alert('Error al eliminar el trabajo');
    }
  };

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trabajos Realizados</h1>
        <Link
          href="/admin/trabajos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Trabajo
        </Link>
      </div>

      {loading ? (
        <p>Cargando trabajos...</p>
      ) : trabajos.length === 0 ? (
        <p>No hay trabajos aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajos.map((trabajo) => (
            <div key={trabajo._id} className="border rounded shadow p-4 relative">
              <img
                src={trabajo.imagenPrincipal}
                alt={trabajo.titulo}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{trabajo.titulo}</h2>
              <p className="text-sm text-gray-500">{trabajo.categoria}</p>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/trabajos/${trabajo._id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(trabajo._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
