import TrabajoForm from '@/app/components/trabajosform/TrabajoForm';

async function getTrabajo(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/trabajos?id=${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('No se pudo obtener el trabajo');

  const data = await res.json();
  return Array.isArray(data) ? data.find((t) => t._id === id) : data;
}

// 👇 No pongas tipos personalizados. Esto funciona.
export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const trabajo = await getTrabajo(params.id);

  if (!trabajo) {
    return <div className="p-8">Trabajo no encontrado</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Trabajo</h1>
      <TrabajoForm initialData={trabajo} />
    </main>
  );
}
