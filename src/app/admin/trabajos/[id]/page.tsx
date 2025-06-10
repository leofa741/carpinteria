'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TrabajoForm from '@/app/components/trabajosform/TrabajoForm';

export default function EditarTrabajoPage() {
  const { id } = useParams();
  const [trabajo, setTrabajo] = useState<any>(null);

  useEffect(() => {
    const fetchTrabajo = async () => {
      try {
        const res = await fetch(`/api/trabajos?id=${id}`);
        const data = await res.json();
        setTrabajo(Array.isArray(data) ? data.find(t => t._id === id) : data);
      } catch (err) {
        console.error('Error al cargar el trabajo', err);
      }
    };

    if (id) fetchTrabajo();
  }, [id]);

  if (!trabajo) return <div className="p-8">Cargando trabajo...</div>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Trabajo</h1>
      <TrabajoForm initialData={trabajo} />
    </main>
  );
}
